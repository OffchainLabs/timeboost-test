import { Address, createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { auctionContractAbi } from '../src/auctionContractAbi';
import {
  getLocalNodeChainInformation,
  sendTransactionToTriggerNewBlock,
  sleep,
} from '../src/helpers';
import dotenv from 'dotenv';
dotenv.config();

// Checks
if (
  !process.env.TB_AUCTION_CONTRACT_ADDRESS ||
  !process.env.PRIVATE_KEY ||
  !process.env.CHAIN_ID ||
  !process.env.RPC
) {
  throw new Error(
    'Missing one or more env variables: TB_AUCTION_CONTRACT_ADDRESS, PRIVATE_KEY, CHAIN_ID, RPC',
  );
}

// Global variables/constants
const auctionContract = process.env.TB_AUCTION_CONTRACT_ADDRESS as Address;
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const networkId = Number(process.env.CHAIN_ID);
const client = createWalletClient({
  chain: getLocalNodeChainInformation(networkId, process.env.RPC!),
  transport: http(process.env.RPC!),
}).extend(publicActions);

const main = async () => {
  // Trigger one transaction to update latest block
  // (needed to get the right round information when no blocks are being created)
  await sendTransactionToTriggerNewBlock(client, account);

  // Get funds deposited
  console.log(`Checking deposited funds by ${account.address}`);
  const depositedBalance = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'balanceOf',
    args: [account.address],
  });
  console.log(`Current balance of ${account.address} in auction contract: ${depositedBalance}`);

  if (depositedBalance <= 0n) {
    console.log(`Deposit balance is 0. No funds to withdraw.`);
    return;
  }

  // Get current block for the log query search later
  const fromBlockForInitLog = await client.getBlockNumber();

  // Initialize withdrawal
  const initWithdrawalTransaction = await client.writeContract({
    account,
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'initiateWithdrawal',
  });
  console.log(`Initiate withdrawal transaction sent: ${initWithdrawalTransaction}`);
  await client.waitForTransactionReceipt({ hash: initWithdrawalTransaction });

  // Wait a few extra seconds for processing
  await sleep(1000 * 5);

  // Getting the WithdrawalInitiated event
  console.log('');
  console.log(`Fetch the latest WithdrawalInitiated log...`);
  const logs = await client.getLogs({
    address: auctionContract,
    event: auctionContractAbi.filter((abiEntry) => abiEntry.name === 'WithdrawalInitiated')[0],
    fromBlock: fromBlockForInitLog,
  });

  // Find the log for our address
  const log = logs.filter(
    (log) => log.args.account?.toLowerCase() === account.address.toLowerCase(),
  )[0];

  // And get the round where we can get our funds
  const withdrawalRound = log.args.roundWithdrawable!;

  // Get the current round
  const currentRound = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'currentRound',
  });
  console.log(
    `Funds can be withdrawn in round ${withdrawalRound} (current round is ${currentRound})`,
  );

  // Wait until the specified round
  console.log('');
  console.log('Waiting for 2 rounds to pass...');
  await sleep(1000 * 60 * Number(withdrawalRound - currentRound));

  // Call the finalize
  console.log('');
  console.log('Finalizing the withdrawal');
  const finalizeWithdrawalTransaction = await client.writeContract({
    account,
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'finalizeWithdrawal',
  });
  console.log(`Finalize withdrawal transaction sent: ${finalizeWithdrawalTransaction}`);
  await client.waitForTransactionReceipt({ hash: finalizeWithdrawalTransaction });

  // Wait a few extra seconds for processing
  await sleep(1000 * 5);

  // Check again the deposited funds
  console.log(`Checking deposited funds by ${account.address}`);
  const depositedBalance2 = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'balanceOf',
    args: [account.address],
  });
  console.log(`Current balance of ${account.address} in auction contract: ${depositedBalance2}`);

  if (depositedBalance2 === 0n) {
    console.log('Funds were successfully withdrawn!');
  } else {
    console.log('It seems there was an issue withdrawing funds');
  }
};

// Main call
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
