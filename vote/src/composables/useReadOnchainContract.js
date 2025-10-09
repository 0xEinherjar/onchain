import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadOnchainContract = () => {
  async function readOnchainContract(functionName, args = []) {
    return await client.readContract({
      abi: abi.Onchain,
      address: contract.Onchain,
      functionName: functionName,
      args: args,
    });
  }

  return { readOnchainContract };
};
