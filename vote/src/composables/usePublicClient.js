import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export const usePublicClient = () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(
      "https://little-dawn-log.base-sepolia.quiknode.pro/e126f498cf283479c141af176f2327cf2a032e8b/"
    ),
  });

  return { client };
};
