import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadPostContract = () => {
  async function readPostContract(functionName, args = []) {
    return await client.readContract({
      abi: abi.PostNFT,
      address: contract.PostNFT,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readPostContract,
  };
};
