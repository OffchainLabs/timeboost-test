import { defineChain } from 'viem';

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

export const logTitle = (text: string) => {
  console.log('');
  console.log('**************************');
  console.log(text);
  console.log('**************************');
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
