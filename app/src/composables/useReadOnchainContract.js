import { abi, contract } from "../contracts/index.js";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadOnchainContract = () => {
  async function readOnchainContract(functionName, args = [], account) {
    return await client.readContract({
      abi: abi.Onchain,
      address: contract.Onchain,
      functionName: functionName,
      args: args,
      account: account,
    });
  }

  return {
    readOnchainContract,
  };
};
