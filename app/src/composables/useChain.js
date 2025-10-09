import { defineChain } from "viem";

export const useChain = () => {
  async function coreTestnet() {
    return defineChain({
      id: 1114,
      name: "Core Dao Testnet",
      nativeCurrency: {
        decimals: 18,
        name: "tCORE2",
        symbol: "tCORE2",
      },
      rpcUrls: {
        default: {
          http: [
            "https://rpc.test2.btcs.network",
          ],
        },
      },
      blockExplorers: {
        default: { name: "Explorer", url: "https://scan.test2.btcs.network" },
      },
    });
  }

  return { coreTestnet };
};
