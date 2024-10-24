import {
  Address,
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  zeroAddress,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { auctionContractAbi } from './auctionContractAbi';
import dotenv from 'dotenv';
dotenv.config();

// Helpers
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Constants (move to environment variables, or get from RPC)
const networkId = 412346;
const networkName = 'LocalL2';
const networkLabel = 'local-l2';

const getLocalNodeChainInformation = () => {
  return defineChain({
    id: networkId,
    name: networkName,
    network: networkLabel,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [process.env.RPC!],
      },
      public: {
        http: [process.env.RPC!],
      },
    },
  });
};

const main = async () => {
  // Trigger one transaction to update latest block
  // (needed to get the right round information when no blocks are being created)
  // console.log(`Sending new transaction to trigger a new block...`);
  const hash = await walletClient.sendTransaction({
    account,
    to: zeroAddress,
    value: 1n,
  });
  // console.log(`Transaction sent: ${hash}`);

  // Get funds deposited
  console.log(`Checking deposited funds by ${account.address}`);
  const depositedBalance = await publicClient.readContract({
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
  const fromBlockForInitLog = await publicClient.getBlockNumber();

  // Initialize withdrawal
  const initWithdrawalTransaction = await walletClient.writeContract({
    account,
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'initiateWithdrawal',
  });
  console.log(`Initiate withdrawal transaction sent: ${initWithdrawalTransaction}`);

  // Wait a few extra seconds for processing
  await sleep(1000 * 5);

  // Getting the WithdrawalInitiated event
  console.log('');
  console.log(`Fetch the latest WithdrawalInitiated log...`);
  const logs = await publicClient.getLogs({
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
  const currentRound = await publicClient.readContract({
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
  const finalizeWithdrawalTransaction = await walletClient.writeContract({
    account,
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'finalizeWithdrawal',
  });
  console.log(`Finalize withdrawal transaction sent: ${finalizeWithdrawalTransaction}`);

  // Wait a few extra seconds for processing
  await sleep(1000 * 5);

  // Check again the deposited funds
  console.log(`Checking deposited funds by ${account.address}`);
  const depositedBalance2 = await publicClient.readContract({
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

// Checks
if (
  !process.env.PRIVATE_KEY ||
  !process.env.CONTENDER_PRIVATE_KEY ||
  !process.env.RPC ||
  !process.env.SEQUENCER_ENDPOINT ||
  !process.env.TB_AUCTION_CONTRACT_ADDRESS ||
  !process.env.TB_BID_VALIDATOR_ENDPOINT
) {
  throw new Error(
    'Missing one or more env variables: PRIVATE_KEY, CONTENDER_PRIVATE_KEY, RPC, SEQUENCER_ENDPOINT, TB_AUCTION_CONTRACT_ADDRESS, TB_BID_VALIDATOR_ENDPOINT',
  );
}

// Global variables/constants
const auctionContract = process.env.TB_AUCTION_CONTRACT_ADDRESS as Address;
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const publicClient = createPublicClient({
  chain: getLocalNodeChainInformation(),
  transport: http(process.env.RPC!),
});
const walletClient = createWalletClient({
  chain: getLocalNodeChainInformation(),
  transport: http(process.env.RPC!),
});

// Main call
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
