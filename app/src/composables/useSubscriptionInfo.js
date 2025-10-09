import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
import { useUtils } from "./useUtils.js";
const { client } = usePublicClient();
const { formatToNumber } = useUtils();

export const useSubscriptionInfo = () => {
  async function getSubscriptionInfo(owner) {
    const results = await client.multicall({
      contracts: [
        {
          abi: abi.Token,
          address: contract.Token,
          functionName: "decimals",
        },
        {
          abi: abi.Token,
          address: contract.Token,
          functionName: "name",
        },
        {
          abi: abi.ProfileNFT,
          address: contract.ProfileNFT,
          functionName: "fees",
        },
        {
          abi: abi.Token,
          address: contract.Token,
          functionName: "balanceOf",
          args: [owner],
        },
      ],
    });
    for (const result of results) {
      if (result.status == "failure") return null;
    }
    return {
      decimals: results[0].result,
      currency: results[1].result,
      price: formatToNumber(results[2].result[2]),
      priceFormated:
        formatToNumber(results[2].result[2]) / 10 ** results[0].result,
      hasEnoughBalance: results[3].result >= results[2].result[2],
    };
  }

  return { getSubscriptionInfo };
};
