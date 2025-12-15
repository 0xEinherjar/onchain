import { createPublicClient, http } from "viem";
import { arcTestnet } from "viem/chains";

export const usePublicClient = () => {
  const client = createPublicClient({
    chain: arcTestnet,
    transport: http(
      "https://rpc.testnet.arc.network"
    ),
  });

  return { client };
};
