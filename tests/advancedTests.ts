import { Address, createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { auctionContractAbi } from '../src/auctionContractAbi';
import dotenv from 'dotenv';
import {
  getLocalNodeChainInformation,
  logSubtitle,
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
const networkId = Number(process.env.CHAIN_ID);
// Adding some leeway (5 seconds) to the auction starting and end time
const roundAuctionStartsAtSecondsInMinute = Number(process.env.AUCTION_STARTS_AT_SECONDS_IN_MINUTE);
const roundAuctionEndsAtSecondsInMinute = Number(process.env.AUCTION_ENDS_AT_SECONDS_IN_MINUTE);
const bidAmount = BigInt(process.env.BID_AMOUNT_WEI ?? 20);
const secondsToWaitInBetweenELTransactions =
  Number(process.env.SECONDS_TO_WAIT_BETWEEN_EL_TRANSACTIONS) ?? 2;

// Instantiating client
const client = createWalletClient({
  chain: getLocalNodeChainInformation(networkId, process.env.RPC!),
  transport: http(process.env.RPC!),
}).extend(publicActions);

// Round timing info (default, will be updated later)
const roundTimingInformation = {
  offsetTimestamp: 0n,
  roundDurationSeconds: 60n,
  auctionClosingSeconds: 15n,
};

const bidTest = async (biddingTokenContract: Address, bidOnMillisecondsInMinute: number) => {
  // Check balance
  logSubtitle('Check deposited funds in Auction contract');
  await checkDepositedFundsInAuctionContract({
    biddingTokenContract,
    account: alice,
    bidAmount,
    client,
    auctionContract,
  });

  // Read current round
  logSubtitle('Getting information about the current auction round');
  const currentRound = await getCurrentRound(
    roundTimingInformation.offsetTimestamp,
    roundTimingInformation.roundDurationSeconds,
  );
  let currentAuctionRound = currentRound + 1n;
  const currentAuctionRoundIsClosed = await isAuctionRoundClosed(
    roundTimingInformation.offsetTimestamp,
    roundTimingInformation.roundDurationSeconds,
    roundTimingInformation.auctionClosingSeconds,
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
  // NOTE: We use `waitUntilMilliSecondsInMinute` here for finer granularity on when
  // to send the bid
  logSubtitle('Sending bid to the Auction contract');
  await sendBid({
    account: alice,
    currentAuctionRound: BigInt(currentAuctionRound),
    bidAmount,
    client,
    auctionContract,
    bidValidatorEndpoint: process.env.TB_BID_VALIDATOR_ENDPOINT!,
    sendAtMillisecondsInMinute: bidOnMillisecondsInMinute,
  });

  // Get current block for the log query search later
  const fromBlock = await client.getBlockNumber();

  // Wait for auction round to finish
  // (we add some leeway to allow for the auctioneer to resolve the round, 5 seconds)
  console.log('');
  console.log(`Waiting for auction to finish...`);
  await waitUntilSecondsInMinute(roundAuctionEndsAtSecondsInMinute + 5);

  // Send another transaction to trigger the auctioneer sending the resolveAuction transaction to the contract
  await sendTransactionToTriggerNewBlock(client, alice);

  // Wait a few extra seconds for processing
  // The auctioneer actually resolves the auction 2 seconds after the auction closing time, so sleep for 3 seconds.
  await sleep(5000 * secondsToWaitInBetweenELTransactions);

  // Look for the latest SetExpressLaneController log
  logSubtitle('Getting the auction winner');
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
};

const main = async () => {
  // Trigger one transaction to update latest block
  // (needed to get the right round information when no blocks are being created)
  await sendTransactionToTriggerNewBlock(client, alice);

  // Read info from the auction contract
  const biddingTokenContract = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'biddingToken',
  });
  console.log(`Current biddingToken: ${biddingTokenContract}`);

  // Getting round timing info
  const roundTimingInfo = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'roundTimingInfo',
  });
  roundTimingInformation.offsetTimestamp = roundTimingInfo[0];
  roundTimingInformation.roundDurationSeconds = roundTimingInfo[1];
  roundTimingInformation.auctionClosingSeconds = roundTimingInfo[2];

  // Bid in exact second of Auction round closed
  logTitle('Bidding on the exact second the Auction round closes (t)');
  try {
    await bidTest(biddingTokenContract, roundAuctionEndsAtSecondsInMinute * 1000);
  } catch (e) {
    // If we are the only ones bidding, there won't be any `SetExpressLaneController` logs
    // We catch the exception here to continue executing the rest of tests
    console.error(e);
  }

  // Bid on last second of Auction round
  logTitle('Bidding on last second of Auction round (t-100ms)');
  await bidTest(biddingTokenContract, (roundAuctionEndsAtSecondsInMinute - 1) * 1000 + 800);
};

// Main call
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
