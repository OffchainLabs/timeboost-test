import {
  Address,
  concat,
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  keccak256,
  numberToBytes,
  pad,
  parseAbi,
  PrivateKeyAccount,
  toHex,
  zeroAddress,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { auctionContractAbi } from './auctionContractAbi';
import dotenv from 'dotenv';
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
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const contenderAccount = privateKeyToAccount(process.env.CONTENDER_PRIVATE_KEY as `0x${string}`);
const networkId = Number(process.env.CHAIN_ID);
const roundAuctionStartsAtSecondsInMinute = Number(process.env.AUCTION_STARTS_AT_SECONDS_IN_MINUTE);
const roundAuctionEndsAtSecondsInMinute = Number(process.env.AUCTION_ENDS_AT_SECONDS_IN_MINUTE);
const bidAmount = 20n;
const contenderBidAmount = 10n;
const bypassSendTransactionToTriggerNewBlock = false;

// Helpers
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const waitUntilSecondsInMinute = (seconds: number) =>
  new Promise(async (resolve) => {
    let currentSeconds = Math.floor((Date.now() / 1000) % 60);
    while (currentSeconds !== seconds) {
      await sleep(500);
      currentSeconds = Math.floor((Date.now() / 1000) % 60);
    }

    resolve(true);
  });

const logTitle = (text: string) => {
  console.log('');
  console.log('**************************');
  console.log(text);
  console.log('**************************');
};

const getLocalNodeChainInformation = () => {
  return defineChain({
    id: networkId,
    name: 'Orbit chain',
    network: 'orbit-chain',
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

// Instantiating clients
const publicClient = createPublicClient({
  chain: getLocalNodeChainInformation(),
  transport: http(process.env.RPC!),
});
const walletClient = createWalletClient({
  chain: getLocalNodeChainInformation(),
  transport: http(process.env.RPC!),
});

// Temporary function until resolving some bugs
const sendTransactionToTriggerNewBlock = async (
  verbose = false
) => {
  if (bypassSendTransactionToTriggerNewBlock) {
    if (verbose) {
      console.log(`Bypassing sending a new transaction to trigger a new block`);
    }
    return;
  }

  if (verbose) {
    console.log(`Sending new transaction to trigger a new block...`);
  }
  const hash = await walletClient.sendTransaction({
    account,
    to: zeroAddress,
    value: 1n,
  });
  if (verbose) {
    console.log(`Transaction sent: ${hash}`);
  }
}

// Checks deposted funds in the auction contract and deposits more funds if needed
const checkDepositedFundsInAuctionContract = async (
  biddingTokenContract: Address,
  account: PrivateKeyAccount,
  bidAmount: bigint,
) => {
  console.log('');
  console.log(`Checking deposited funds for ${account.address} to bid ${bidAmount}`);

  const depositedBalance = await publicClient.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'balanceOf',
    args: [account.address],
  });
  console.log(`Current balance of ${account.address} in auction contract: ${depositedBalance}`);

  if (depositedBalance < bidAmount) {
    // User does not have enough funds to bid `bidAmount`
    console.log(`User does not have enough funds to bid ${bidAmount}, making a new deposit...`);

    // Check balance of the user in the bidding token
    const biddingTokenBalance = await publicClient.readContract({
      address: biddingTokenContract,
      abi: parseAbi(['function balanceOf(address) public view returns (uint256)']),
      functionName: 'balanceOf',
      args: [account.address],
    });
    console.log(`Current balance of ${account.address} for bidding token: ${biddingTokenBalance}`);

    if (biddingTokenBalance < bidAmount) {
      throw new Error(
        `Balance of the user in the ERC-20 bidding token is not enough to make the bid. Exiting...`,
      );
    }

    // Approving spending tokens
    const approveHash = await walletClient.writeContract({
      account,
      address: biddingTokenContract,
      abi: parseAbi(['function approve(address,uint256)']),
      functionName: 'approve',
      args: [auctionContract, bidAmount - depositedBalance],
    });
    console.log(`Approve transaction sent: ${approveHash}`);

    // Making the deposit
    const depositHash = await walletClient.writeContract({
      account,
      address: auctionContract,
      abi: auctionContractAbi,
      functionName: 'deposit',
      args: [bidAmount - depositedBalance],
    });
    console.log(`Deposit transaction sent: ${depositHash}`);
  }
};

// Sends a bid to the bid validator endpoint
const sendBid = async (
  account: PrivateKeyAccount,
  currentAuctionRound: bigint,
  bidAmount: bigint,
) => {
  console.log('');
  console.log(`Sending bid of account ${account.address}: ${bidAmount}`);

  const hexChainId: `0x${string}` = `0x${Number(publicClient.chain.id).toString(16)}`;

  const signatureData = await publicClient.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'getBidBytes',
    args: [currentAuctionRound, bidAmount, account.address],
  });
  /*
  const signatureData = concat([
    keccak256(toHex('TIMEBOOST_BID')),
    pad(hexChainId),
    auctionContract,
    toHex(numberToBytes(currentAuctionRound, { size: 8 })),
    toHex(numberToBytes(bidAmount, { size: 32 })),
    account.address,
  ]);
  */
  const signature = await account.signMessage({
    message: { raw: signatureData },
  });

  try {
    const res = await fetch(process.env.TB_BID_VALIDATOR_ENDPOINT!, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'submit-bid',
        method: 'auctioneer_submitBid',
        params: [
          {
            chainId: hexChainId,
            expressLaneController: account.address,
            auctionContractAddress: auctionContract,
            round: `0x${currentAuctionRound.toString(16)}`,
            amount: `0x${Number(bidAmount).toString(16)}`,
            signature: signature,
          },
        ],
      }),
    });

    if (res.status != 200) {
      console.error(
        `Error while calling the bid validator at ${process.env.TB_BID_VALIDATOR}: status is ${res.status}`,
      );
      return;
    }

    const data = await res.json();
    if ('error' in data) {
      console.error(
        `Error while calling the bid validator at ${process.env.TB_BID_VALIDATOR}: ${data.error.message}`,
      );
      return;
    }

    console.log(`Bid for ${bidAmount} successfully received by the bid validator`);
  } catch (err) {
    console.error(err);
    return;
  }
};

// Sends a transaction to the express lane
const sendExpressLaneTransaction = async (
  account: PrivateKeyAccount,
  transactionSigner: PrivateKeyAccount,
  currentRound: bigint,
  sequenceNumber: number,
) => {
  console.log('');
  console.log('Sending a transaction through the express lane');

  // Get the current nonce of the account
  // (since we'll be sending transactions directly to the sequencer endpoint
  // and viem doesn't handle the nonce very well in those cases)
  const currentNonce = await publicClient.getTransactionCount({  
    address: account.address,
  });

  const chainId = Number(publicClient.chain.id);
  const hexChainId: `0x${string}` = `0x${chainId.toString(16)}`;
  const transaction = await walletClient.prepareTransactionRequest({
    account,
    to: '0x0000000000000000000000000000000000000001',
    value: 1n,
    nonce: currentNonce,
  });
  const serializedTransaction = await walletClient.signTransaction(transaction);

  const signatureData = concat([
    keccak256(toHex('TIMEBOOST_BID')),
    pad(hexChainId),
    auctionContract,
    toHex(numberToBytes(currentRound, { size: 8 })),
    toHex(numberToBytes(sequenceNumber, { size: 8 })),
    serializedTransaction,
  ]);
  const signature = await account.signMessage({
    message: { raw: signatureData },
  });

  try {
    const res = await fetch(process.env.SEQUENCER_ENDPOINT!, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `express-lane-tx`,
        method: 'timeboost_sendExpressLaneTransaction',
        params: [
          {
            chainId: hexChainId,
            round: `0x${currentRound.toString(16)}`,
            auctionContractAddress: auctionContract,
            sequenceNumber: `0x${sequenceNumber.toString(16)}`,
            transaction: serializedTransaction,
            options: {},
            signature: signature,
          },
        ],
      }),
    });

    if (res.status != 200) {
      console.error(
        `Error while sending a transaction through the express lane at ${process.env.SEQUENCER_ENDPOINT}: status is ${res.status}`,
      );
      return;
    }

    const data = await res.json();
    if ('error' in data) {
      console.error(
        `Error while sending a transaction through the express lane at ${process.env.SEQUENCER_ENDPOINT}: ${data.error.message}`,
      );
      return;
    }

    console.log(`Transaction successfully sent through the express lane`);
  } catch (err) {
    console.error(err);
    return;
  }
};

const main = async () => {
  // Trigger one transaction to update latest block
  // (needed to get the right round information when no blocks are being created)
  await sendTransactionToTriggerNewBlock();

  // Read info from the auction contract
  logTitle('Get information from the Auction contract');
  const reservePrice = await publicClient.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'reservePrice',
  });
  console.log(`Current reservePrice: ${reservePrice}`);

  const biddingTokenContract = await publicClient.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'biddingToken',
  });
  console.log(`Current biddingToken: ${biddingTokenContract}`);

  const roundTimingInfo = await publicClient.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'roundTimingInfo',
  });
  console.log(`Round timing info: ${roundTimingInfo}`);

  // Check balances
  logTitle('Depositing funds into the Auction contract');
  await checkDepositedFundsInAuctionContract(biddingTokenContract, account, bidAmount);
  await checkDepositedFundsInAuctionContract(
    biddingTokenContract,
    contenderAccount,
    contenderBidAmount,
  );

  // Read current round
  logTitle('Getting information about the current auction round');
  const currentRound = await publicClient.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'currentRound',
  });
  let currentAuctionRound = currentRound + 1n;
  let currentAuctionRoundIsClosed = await publicClient.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'isAuctionRoundClosed',
  });
  console.log(
    `Current auction round: ${currentAuctionRound} (${currentAuctionRoundIsClosed ? 'CLOSED' : 'OPEN'})`,
  );

  if (currentAuctionRoundIsClosed) {
    console.log(`Current auction round is closed. Waiting a few seconds for the next one...`);
    await waitUntilSecondsInMinute(roundAuctionStartsAtSecondsInMinute);
    currentAuctionRound += 1n;
    currentAuctionRoundIsClosed = false;
  }

  // Bidding with main account
  logTitle('Sending bids to the Auction contract');
  await sendBid(account, currentAuctionRound, bidAmount);
  await sendBid(contenderAccount, currentAuctionRound, contenderBidAmount);

  // Get current block for the log query search later
  const fromBlock = await publicClient.getBlockNumber();

  // Wait for auction round to finish
  console.log('');
  console.log(`Waiting for auction to finish...`);
  await waitUntilSecondsInMinute(roundAuctionEndsAtSecondsInMinute);

  // Send another transaction to trigger the auctioneer sending the resolveAuction transaction to the contract
  await sendTransactionToTriggerNewBlock();

  // Wait a few extra seconds for processing
  await sleep(1000 * 5);

  // Look for the latest SetExpressLaneController log
  logTitle('Getting the auction winner');
  console.log(`Fetch the latest SetExpressLaneController log...`);
  const logs = await publicClient.getLogs({
    address: auctionContract,
    event: auctionContractAbi.filter((abiEntry) => abiEntry.name === 'SetExpressLaneController')[0],
    fromBlock,
  });

  // Verify whether we are the current express lane controller
  console.log('');
  const newExpressLaneController = logs[0].args.newExpressLaneController;
  console.log(`New express lane controller: ${newExpressLaneController}`);
  if (account.address === newExpressLaneController) {
    console.log(`Auction won. You are the new express lane controller!`);
  } else {
    console.log(`Auction lost. The new express lane controller is ${newExpressLaneController}`);
    return;
  }

  // Wait for the round to start
  console.log('');
  console.log('Waiting for the round to start...');
  await waitUntilSecondsInMinute(roundAuctionStartsAtSecondsInMinute);

  // Sending a transaction through the express lane
  logTitle('Sending a express lane transaction');
  await sendExpressLaneTransaction(account, account, currentAuctionRound, 0);

  // Wait a few seconds
  await sleep(1000 * 5);
  await sendTransactionToTriggerNewBlock();
  await sleep(1000 * 5);

  // Transfer rights to a different account
  logTitle('Transferring rights to a different account');
  const transferELC = await walletClient.writeContract({
    account,
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'transferExpressLaneController',
    args: [currentAuctionRound, contenderAccount.address],
  });
  console.log(`Transfer EL controller transaction hash: ${transferELC}`);

  // Try to send a new transaction through the express lane (it should fail)
  logTitle('Sending a new express lane transaction (it should fail)');
  await sendExpressLaneTransaction(account, account, currentAuctionRound, 1);

  // Wait a few seconds
  await sleep(1000 * 5);
  await sendTransactionToTriggerNewBlock();
  await sleep(1000 * 5);

  // Sending a new transaction as the new address
  logTitle('Sending a new express lane transaction as the new address (it should work)');
  await sendExpressLaneTransaction(contenderAccount, contenderAccount, currentAuctionRound, 1);

  // Wait a few seconds
  await sleep(1000 * 5);
  await sendTransactionToTriggerNewBlock();
  await sleep(1000 * 5);
};

// Main call
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
