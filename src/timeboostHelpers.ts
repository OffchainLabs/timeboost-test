import {
  Address,
  concat,
  keccak256,
  numberToBytes,
  pad,
  parseAbi,
  PrivateKeyAccount,
  PublicClient,
  toHex,
  TransactionRequestLegacy,
} from 'viem';
import { auctionContractAbi } from './auctionContractAbi';
import { waitUntilMilliSecondsInMinute, WalletClientWithPublicActions } from './helpers';

export type CheckDepositedFundsParameters = {
  biddingTokenContract: Address;
  account: PrivateKeyAccount;
  bidAmount: bigint;
  client: WalletClientWithPublicActions;
  auctionContract: Address;
};

export type SendBidParameters = {
  account: PrivateKeyAccount;
  currentAuctionRound: bigint;
  bidAmount: bigint;
  client: PublicClient;
  auctionContract: Address;
  bidValidatorEndpoint: string;
  sendAtMillisecondsInMinute?: number;
};

export type SendExpressLaneTransactionParameters = {
  ELController: PrivateKeyAccount;
  transactionSigner: PrivateKeyAccount;
  currentRound: bigint;
  sequenceNumber: number;
  client: WalletClientWithPublicActions;
  auctionContract: Address;
};

export type PrepareExpressLaneTransactionPayloadParameters = {
  ELController: PrivateKeyAccount;
  transactionSigner: PrivateKeyAccount;
  transaction: TransactionRequestLegacy;
  client: WalletClientWithPublicActions;
  currentRound: bigint;
  sequenceNumber: number;
  auctionContract: Address;
};

// Get current Timeboost round
export const getCurrentRound = async (offsetTimestamp: bigint, roundDurationSeconds: bigint) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return BigInt(
    Math.floor((currentTimestamp - Number(offsetTimestamp)) / Number(roundDurationSeconds)),
  );
};

// Check if auction round is closed
export const isAuctionRoundClosed = async (
  offsetTimestamp: bigint,
  roundDurationSeconds: bigint,
  auctionClosingSeconds: bigint,
) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timeInRound = (currentTimestamp - Number(offsetTimestamp)) % Number(roundDurationSeconds);
  return timeInRound >= roundDurationSeconds - auctionClosingSeconds;
};

// Checks deposited funds in the auction contract and deposits more funds if needed
export const checkDepositedFundsInAuctionContract = async ({
  biddingTokenContract,
  account,
  bidAmount,
  client,
  auctionContract,
}: CheckDepositedFundsParameters) => {
  console.log('');
  console.log(`Checking deposited funds for ${account.address} to bid ${bidAmount}`);

  const depositedBalance = await client.readContract({
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
    const biddingTokenBalance = await client.readContract({
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
    const approveHash = await client.writeContract({
      account,
      address: biddingTokenContract,
      abi: parseAbi(['function approve(address,uint256)']),
      functionName: 'approve',
      args: [auctionContract, bidAmount - depositedBalance],
      chain: client.chain!,
    });
    console.log(`Approve transaction sent: ${approveHash}`);
    await client.waitForTransactionReceipt({ hash: approveHash });

    // Making the deposit
    const depositHash = await client.writeContract({
      account,
      address: auctionContract,
      abi: auctionContractAbi,
      functionName: 'deposit',
      args: [bidAmount - depositedBalance],
      chain: client.chain!,
    });
    console.log(`Deposit transaction sent: ${depositHash}`);
    await client.waitForTransactionReceipt({ hash: depositHash });
  }
};

// Sends a bid to the bid validator endpoint
export const sendBid = async ({
  account,
  currentAuctionRound,
  bidAmount,
  client,
  auctionContract,
  bidValidatorEndpoint,
  sendAtMillisecondsInMinute,
}: SendBidParameters) => {
  console.log('');
  console.log(`Sending bid of account ${account.address}: ${bidAmount}`);

  const hexChainId: `0x${string}` = `0x${Number(client.chain!.id).toString(16)}`;

  const signatureData = await client.readContract({
    address: auctionContract,
    abi: auctionContractAbi,
    functionName: 'getBidHash',
    args: [currentAuctionRound, account.address, bidAmount],
  });
  /*
  // Crafting the EIP-712 signature with viem
  const signatureData = hashTypedData({
    domain: {
      name: "ExpressLaneAuction",
      version: "1",
      chainId: Number(client.chain.id),
      verifyingContract: auctionContract,
    },
    types: {
      Bid: [
        { name: 'round', type: 'uint64' },
        { name: 'expressLaneController', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ]
    },
    primaryType: 'Bid',
    message: {
      round: currentAuctionRound,
      expressLaneController: account.address,
      amount: bidAmount,
    }
  });
  */
  const signature = await account.sign({
    hash: signatureData,
  });

  if (sendAtMillisecondsInMinute) {
    console.log(
      `Waiting until right time to make the bid (${sendAtMillisecondsInMinute}ms on the minute)...`,
    );
    await waitUntilMilliSecondsInMinute(sendAtMillisecondsInMinute);
    console.log('Sending bid...');
  }

  try {
    const res = await fetch(bidValidatorEndpoint, {
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
        `Error while calling the bid validator at ${bidValidatorEndpoint}: status is ${res.status}`,
      );
      return;
    }

    const data = await res.json();
    if ('error' in data) {
      console.error(
        `Error while calling the bid validator at ${bidValidatorEndpoint}: ${data.error.message}`,
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
const destinationAccountOfELTransactions = '0x0000000000000000000000000000000000000001';
const weiToSendOnELTransactions = 1n;

export const sendExpressLaneTransaction = async ({
  ELController,
  transactionSigner,
  currentRound,
  sequenceNumber,
  client,
  auctionContract,
}: SendExpressLaneTransactionParameters) => {
  console.log('');
  console.log('Sending a transaction through the express lane');

  const chainId = Number(client.chain!.id);
  const hexChainId: `0x${string}` = `0x${chainId.toString(16)}`;
  const transaction = await client.prepareTransactionRequest({
    chain: client.chain!,
    account: transactionSigner.address,
    to: destinationAccountOfELTransactions,
    value: weiToSendOnELTransactions,
    type: 'legacy',
  });
  const serializedTransaction = await transactionSigner.signTransaction(transaction);

  const signatureData = concat([
    keccak256(toHex('TIMEBOOST_BID')),
    pad(hexChainId),
    auctionContract,
    toHex(numberToBytes(currentRound, { size: 8 })),
    toHex(numberToBytes(sequenceNumber, { size: 8 })),
    serializedTransaction,
  ]);
  const signature = await ELController.signMessage({
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

export const prepareExpressLaneTransactionPayload = async ({
  ELController,
  transactionSigner,
  transaction,
  client,
  currentRound,
  sequenceNumber,
  auctionContract,
}: PrepareExpressLaneTransactionPayloadParameters) => {
  const chainId = Number(client.chain!.id);
  const hexChainId: `0x${string}` = `0x${chainId.toString(16)}`;
  const serializedTransaction = await transactionSigner.signTransaction(transaction);

  const signatureData = concat([
    keccak256(toHex('TIMEBOOST_BID')),
    pad(hexChainId),
    auctionContract,
    toHex(numberToBytes(currentRound, { size: 8 })),
    toHex(numberToBytes(sequenceNumber, { size: 8 })),
    serializedTransaction,
  ]);
  const signature = await ELController.signMessage({
    message: { raw: signatureData },
  });

  return {
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
  };
};
