import { createPublicClient, http } from "viem";
import { arcTestnet } from "viem/chains";

export const usePublicClient = () => {
  const client = createPublicClient({
    chain: arcTestnet,
    transport: http(
      "https://little-dawn-log.arc-testnet.quiknode.pro/e126f498cf283479c141af176f2327cf2a032e8b/"
    ),
  });

  return { client };
};
