import { useUtils } from "./useUtils.js";
import { useReadTokenContract } from "./useReadTokenContract.js";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();
const { readTokenContract } = useReadTokenContract();
const { formatToNumber } = useUtils();

export const usePaidFollowModule = () => {
  async function getModuleInfo() {
    try {
      const resultsPaidFollowModule = await client.multicall({
        contracts: [
          {
            abi: abi.PaidFollowModule,
            address: contract.PaidFollowModule,
            functionName: "fee",
          },
          {
            abi: abi.PaidFollowModule,
            address: contract.PaidFollowModule,
            functionName: "token",
          },
        ],
      });
      for (const result of resultsPaidFollowModule) {
        if (result.status == "failure") return null;
      }
      const resultsToken = await client.multicall({
        contracts: [
          {
            abi: abi.Token,
            address: resultsPaidFollowModule[1].result,
            functionName: "symbol",
          },
          {
            abi: abi.Token,
            address: resultsPaidFollowModule[1].result,
            functionName: "decimals",
          },
        ],
      });
      for (const result of resultsToken) {
        if (result.status == "failure") return null;
      }
      return {
        success: true,
        data: {
          token: resultsPaidFollowModule[1].result,
          symbol: resultsToken[0].result,
          fee: formatToNumber(resultsPaidFollowModule[0].result),
          feeFormatted: formatToNumber(resultsPaidFollowModule[0].result) / 10 ** resultsToken[1].result,
        },
      };
    } catch (error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.args[0] ?? "";
          if (errorName) return { success: false, message: errorName };
        }
      }
      return { success: false, message: "" };
    }
  }

  return { getModuleInfo };
};
