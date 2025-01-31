import { Address, createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { auctionContractAbi } from '../src/auctionContractAbi';
import dotenv from 'dotenv';
import {
  getLocalNodeChainInformation,
  logTitle,
  sendTransactionToTriggerNewBlock,
  sleep,
  waitUntilSecondsInMinute,
} from '../src/helpers';
import {
  checkDepositedFundsInAuctionContract,
  getCurrentRound,
  isAuctionRoundClosed,
  sendBid,
  sendExpressLaneTransaction,
} from '../src/timeboostHelpers';
dotenv.config();

// env variables check
if (
  !process.env.PRIVATE_KEY ||
  !process.env.CONTENDER_PRIVATE_KEY ||
  !process.env.RPC ||
  !process.env.CHAIN_ID ||
  !process.env.SEQUENCER_ENDPOINT ||
  !process.env.TB_AUCTION_CONTRACT_ADDRESS ||
  !process.env.TB_BID_VALIDATOR_ENDPOINT ||
  !process.env.AUCTION_STARTS_AT_SECONDS_IN_MINUTE ||
  !process.env.AUCTION_ENDS_AT_SECONDS_IN_MINUTE
) {
  throw new Error(
    'Missing one or more env variables: PRIVATE_KEY, CONTENDER_PRIVATE_KEY, RPC, CHAIN_ID, SEQUENCER_ENDPOINT, TB_AUCTION_CONTRACT_ADDRESS, TB_BID_VALIDATOR_ENDPOINT, AUCTION_STARTS_AT_SECONDS_IN_MINUTE, AUCTION_ENDS_AT_SECONDS_IN_MINUTE',
  );
}

// Global variables/constants
const auctionContract = process.env.TB_AUCTION_CONTRACT_ADDRESS as Address;
const alice = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const bob = privateKeyToAccount(process.env.CONTENDER_PRIVATE_KEY as `0x${string}`);
const networkId = Number(process.env.CHAIN_ID);
// Adding some leeway (5 seconds) to the auction starting and end time
const roundAuctionStartsAtSecondsInMinute =
  Number(process.env.AUCTION_STARTS_AT_SECONDS_IN_MINUTE) + 5;
const roundAuctionEndsAtSecondsInMinute = Number(process.env.AUCTION_ENDS_AT_SECONDS_IN_MINUTE) + 5;
const bidAmount = BigInt(process.env.BID_AMOUNT_WEI ?? 20);
const contenderBidAmount = BigInt(process.env.CONTENDER_BID_AMOUNT_WEI ?? 10);
const secondsToWaitInBetweenELTransactions =
  Number(process.env.SECONDS_TO_WAIT_BETWEEN_EL_TRANSACTIONS) ?? 2;
const onlyBiddingMode =
  process.env.ONLY_BIDDING_MODE && process.env.ONLY_BIDDING_MODE === 'true' ? true : false;
const destinationAccountOfELTransactions = '0x0000000000000000000000000000000000000001';
const weiToSendOnELTransactions = 1n;

// Instantiating client
const client = createWalletClient({
  chain: getLocalNodeChainInformation(networkId, process.env.RPC!),
  transport: http(process.env.RPC!),
}).extend(publicActions);

const main = async () => {
  // Trigger one transaction to update latest block
  // (needed to get the right round information when no blocks are being created)
  await sendTransactionToTriggerNewBlock(client, bob);

  // Read info from the auction contract
  logTitle('Get information from the Auction contract');
  const reservePrice = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'reservePrice',
  });
  console.log(`Current reservePrice: ${reservePrice}`);

  const biddingTokenContract = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'biddingToken',
  });
  console.log(`Current biddingToken: ${biddingTokenContract}`);

  const roundTimingInfo = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'roundTimingInfo',
  });
  console.log(`Round timing info: ${roundTimingInfo}`);

  // Check balances
  logTitle('Depositing funds into the Auction contract');
  await checkDepositedFundsInAuctionContract({
    biddingTokenContract,
    account: alice,
    bidAmount,
    client,
    auctionContract,
  });
  await checkDepositedFundsInAuctionContract({
    biddingTokenContract,
    account: bob,
    bidAmount: contenderBidAmount,
    client,
    auctionContract,
  });

  // Read current round
  logTitle('Getting information about the current auction round');
  const currentRound = await getCurrentRound(roundTimingInfo[0], roundTimingInfo[1]);
  let currentAuctionRound = currentRound + 1n;
  const currentAuctionRoundIsClosed = await isAuctionRoundClosed(
    roundTimingInfo[0],
    roundTimingInfo[1],
    roundTimingInfo[2],
  );
  console.log(
    `Current auction round: ${currentAuctionRound} (${currentAuctionRoundIsClosed ? 'CLOSED' : 'OPEN'})`,
  );

  if (currentAuctionRoundIsClosed) {
    console.log(`Current auction round is closed. Waiting a few seconds for the next one...`);
    await waitUntilSecondsInMinute(roundAuctionStartsAtSecondsInMinute);
    currentAuctionRound += 1n;
  }

  // Bidding with main account
  logTitle('Sending bids to the Auction contract');
  await sendBid({
    account: alice,
    currentAuctionRound,
    bidAmount,
    client,
    auctionContract,
    bidValidatorEndpoint: process.env.TB_BID_VALIDATOR_ENDPOINT!,
  });
  await sendBid({
    account: bob,
    currentAuctionRound,
    bidAmount: contenderBidAmount,
    client,
    auctionContract,
    bidValidatorEndpoint: process.env.TB_BID_VALIDATOR_ENDPOINT!,
  });

  // Get current block for the log query search later
  const fromBlock = await client.getBlockNumber();

  // Wait for auction round to finish
  console.log('');
  console.log(`Waiting for auction to finish...`);
  await waitUntilSecondsInMinute(roundAuctionEndsAtSecondsInMinute);

  // Send another transaction to trigger the auctioneer sending the resolveAuction transaction to the contract
  await sendTransactionToTriggerNewBlock(client, bob);

  // Wait a few extra seconds for processing
  // The auctioneer actually resolves the auction 2 seconds after the auction closing time, so sleep for 3 seconds.
  await sleep(3000 * secondsToWaitInBetweenELTransactions);

  // Look for the latest SetExpressLaneController log
  logTitle('Getting the auction winner');
  const currentBlock = await client.getBlockNumber();
  console.log(`Fetch the latest SetExpressLaneController log...`);
  const logs = await client.getLogs({
    address: auctionContract,
    event: auctionContractAbi.filter((abiEntry) => abiEntry.name === 'SetExpressLaneController')[0],
    fromBlock,
  });

  if (logs.length === 0) {
    throw new Error(
      `No SetExpressLaneController logs found. Searched from block ${fromBlock} to ${currentBlock}`,
    );
  }

  // Verify whether we are the current express lane controller
  console.log('');
  const newExpressLaneController = logs[logs.length - 1].args.newExpressLaneController;
  console.log(`New express lane controller: ${newExpressLaneController}`);
  if (alice.address === newExpressLaneController) {
    console.log(`Auction won. You are the new express lane controller!`);
  } else {
    console.log(`Auction lost. The new express lane controller is ${newExpressLaneController}`);
    return;
  }

  // Wait for the round to start
  console.log('');
  console.log('Waiting for the round to start...');
  await waitUntilSecondsInMinute(roundAuctionStartsAtSecondsInMinute);

  // If only bidding, we stop here
  if (onlyBiddingMode) {
    console.log('Only bidding mode is true, so no EL transactions are sent.');
    console.log(
      'You can now execute the bash script to test sending EL transactions through it by using the following command:',
    );
    console.log(`yarn run sendELTransactions ${currentAuctionRound}`);
    return;
  }

  // Keeping track of the sequencer number
  let sequenceNumber = 0;

  // Getting initial balance of the account that receives test funds to verify
  // that all EL transactions were executed successfully
  const initialBalance = await client.getBalance({
    address: destinationAccountOfELTransactions,
  });
  let elTransactionsSent = 0;

  // Sending a transaction through the express lane
  logTitle('Sending a express lane transaction');
  await sendExpressLaneTransaction({
    ELController: alice,
    transactionSigner: alice,
    currentRound: currentAuctionRound,
    sequenceNumber,
    client,
    auctionContract,
  });
  sequenceNumber++;
  elTransactionsSent++;

  // Wait a few seconds
  await sleep(1000 * secondsToWaitInBetweenELTransactions);
  await sendTransactionToTriggerNewBlock(client, alice);
  await sleep(1000 * secondsToWaitInBetweenELTransactions);

  // Sending a transaction through the express lane
  logTitle('Sending a express lane transaction signed by a different account');
  await sendExpressLaneTransaction({
    ELController: alice,
    transactionSigner: bob,
    currentRound: currentAuctionRound,
    sequenceNumber,
    client,
    auctionContract,
  });
  sequenceNumber++;
  elTransactionsSent++;

  // Wait a few seconds
  await sleep(1000 * secondsToWaitInBetweenELTransactions);
  await sendTransactionToTriggerNewBlock(client, alice);
  await sleep(1000 * secondsToWaitInBetweenELTransactions);

  // Iin the initial release of Timeboost, transferring of express lane control via the either
  // the setTransferor or the transferExpressLaneController will not be supported by the Arbitrum
  // Nitro node software.
  /*
  // Transfer rights to a different account
  logTitle('Transferring rights to a different account');
  const transferELC = await client.writeContract({
    account: alice,
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'transferExpressLaneController',
    args: [currentAuctionRound, bob.address],
  });
  console.log(`Transfer EL controller transaction hash: ${transferELC}`);
  await client.waitForTransactionReceipt({ hash: transferELC })

  // Wait a few seconds
  await sleep(1000 * secondsToWaitInBetweenELTransactions);
  await sendTransactionToTriggerNewBlock(client, alice);
  await sleep(1000 * secondsToWaitInBetweenELTransactions);

  console.log(`Fetch the latest SetExpressLaneController log...`);
  const newLogs = await client.getLogs({
    address: auctionContract,
    event: auctionContractAbi.filter((abiEntry) => abiEntry.name === 'SetExpressLaneController')[0],
    fromBlock,
  });
  const newExpressLaneController2 = newLogs[newLogs.length - 1].args.newExpressLaneController;
  console.log(`New express lane controller: ${newExpressLaneController2}`);
  if (bob.address === newExpressLaneController2) {
    console.log(
      `The express lane controller was successfully transferred to ${newExpressLaneController2}`,
    );
  } else {
    console.log(
      `The express lane controller was not transferred. The controller is ${newExpressLaneController2}`,
    );
  }

  // Reset the sequence number
  sequenceNumber = 0;

  // Try to send a new transaction through the express lane (it should fail)
  logTitle('Sending a new express lane transaction as the previous EL controller (it should fail)');
  await sendExpressLaneTransaction({
    ELController: alice,
    transactionSigner: alice,
    currentRound: currentAuctionRound,
    sequenceNumber,
    client,
    auctionContract,
  });

  // Wait a few seconds
  await sleep(1000 * secondsToWaitInBetweenELTransactions);
  await sendTransactionToTriggerNewBlock(client, alice);
  await sleep(1000 * secondsToWaitInBetweenELTransactions);

  // Sending a new transaction as the new address
  logTitle('Sending a new express lane transaction as the new address (it should work)');
  await sendExpressLaneTransaction({
    ELController: bob,
    transactionSigner: bob,
    currentRound: currentAuctionRound,
    sequenceNumber,
    client,
    auctionContract,
  });
  sequenceNumber++;
  elTransactionsSent++;

  // Wait a few seconds
  await sleep(1000 * secondsToWaitInBetweenELTransactions);
  await sendTransactionToTriggerNewBlock(client, alice);
  await sleep(1000 * secondsToWaitInBetweenELTransactions);

  // Sending a new transaction as the new address
  logTitle('Sending a new express lane transaction signed by a different user');
  await sendExpressLaneTransaction({
    ELController: bob,
    transactionSigner: alice,
    currentRound: currentAuctionRound,
    sequenceNumber,
    client,
    auctionContract,
  });
  sequenceNumber++;
  elTransactionsSent++;

  // Wait a few seconds
  await sleep(1000 * secondsToWaitInBetweenELTransactions);
  await sendTransactionToTriggerNewBlock(client, alice);
  await sleep(1000 * secondsToWaitInBetweenELTransactions);
  */

  // Check final balance of testing account
  const finalBalance = await client.getBalance({
    address: destinationAccountOfELTransactions,
  });
  const expectedBalance = initialBalance + BigInt(elTransactionsSent) * weiToSendOnELTransactions;
  if (expectedBalance !== finalBalance) {
    console.error(
      `Final balance is not expected: Final balance is ${finalBalance}, but expected was ${expectedBalance}`,
    );
  } else {
    console.log(`Final balance ${finalBalance} matches the expected value.`);
  }
};

// Main call
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
