import { defineChain, zeroAddress } from 'viem';
import type {
  Account,
  Client,
  Chain,
  PublicActions,
  RpcSchema,
  Transport,
  WalletActions,
  PrivateKeyAccount,
} from 'viem';
import dotenv from 'dotenv';
dotenv.config();

export type WalletClientWithPublicActions<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = Client<
  transport,
  chain,
  account,
  RpcSchema,
  PublicActions<transport, chain, account> & WalletActions<chain, account>
>;

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitUntilSecondsInMinute = (seconds: number) =>
  new Promise(async (resolve) => {
    let currentSeconds = Math.floor((Date.now() / 1000) % 60);
    while (currentSeconds !== seconds) {
      await sleep(500);
      currentSeconds = Math.floor((Date.now() / 1000) % 60);
    }

    resolve(true);
  });

export const waitUntilMilliSecondsInMinute = (milliseconds: number) =>
  new Promise(async (resolve) => {
    const range = 50; // 100ms range (±50ms)
    let currentMilliseconds = Date.now() % 60000;
    while (
      currentMilliseconds < milliseconds - range ||
      currentMilliseconds > milliseconds + range
    ) {
      await sleep(10);
      currentMilliseconds = Date.now() % 60000;
    }

    resolve(true);
  });

export const logTitle = (text: string) => {
  console.log('');
  console.log('**************************');
  console.log(text);
  console.log('**************************');
};

export const logSubtitle = (text: string) => {
  console.log('');
  console.log(text);
  console.log('--------------------------');
};

export const getLocalNodeChainInformation = (networkId: number, rpc: string) => {
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
        http: [rpc],
      },
      public: {
        http: [rpc],
      },
    },
  });
};

// Temporary function until some bugs are resolved
const sendTransactionToTriggerNewBlocks =
  process.env.SEND_TRANSACTION_TO_TRIGGER_NEW_BLOCKS &&
  process.env.SEND_TRANSACTION_TO_TRIGGER_NEW_BLOCKS === 'true'
    ? true
    : false;
export const sendTransactionToTriggerNewBlock = async (
  client: WalletClientWithPublicActions,
  sender: PrivateKeyAccount,
  verbose = false,
) => {
  if (!sendTransactionToTriggerNewBlocks) {
    if (verbose) {
      console.log(`Bypassing sending a new transaction to trigger a new block`);
    }
    return;
  }

  if (verbose) {
    console.log(`Sending new transaction to trigger a new block...`);
  }
  const hash = await client.sendTransaction({
    chain: client.chain!,
    account: sender,
    to: zeroAddress,
    value: 1n,
  });
  if (verbose) {
    console.log(`Transaction sent: ${hash}`);
  }
  await client.waitForTransactionReceipt({ hash: hash })
};
