import { http, createConfig } from "@wagmi/vue";
import { metaMask, coinbaseWallet } from "@wagmi/vue/connectors";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";
import { baseSepolia } from "viem/chains";

const binanceWallet = getWagmiConnectorV2();

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [metaMask(), binanceWallet(), coinbaseWallet()],
  transports: {
    [baseSepolia.id]: http(
      "https://little-dawn-log.base-sepolia.quiknode.pro/e126f498cf283479c141af176f2327cf2a032e8b/"
    ),
  },
});
