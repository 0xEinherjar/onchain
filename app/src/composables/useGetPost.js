import { storeToRefs } from "pinia";
import { useReadOnchainContract } from "./useReadOnchainContract.js";
import { useReadPostContract } from "./useReadPostContract.js";
import { useReadProfileContract } from "./useReadProfileContract.js";
import { useAccountStore } from "../store/account.js";
import { usePrepare } from "./prepare.js";
import { isAddress } from "viem";
const { readOnchainContract } = useReadOnchainContract();
const { readProfileContract } = useReadProfileContract();
const { readPostContract } = useReadPostContract();
const prepare = usePrepare();

export const useGetPost = () => {
  async function getPost(postId) {
    try {
      const postInfo = {};
      const { account } = storeToRefs(useAccountStore());
      let userId = await readOnchainContract("profileByPost", [postId]);
      userId = Number(String(userId).replace("n", ""));
      if (userId == 0)
        return { success: false, message: "Publication not found" };
      const owner = await readOnchainContract("addressByProfileId", [userId]);
      if (!isAddress(owner))
        return { success: false, message: "User not found" };
      Object.assign(postInfo, { owner });
      const user = await readProfileContract("getProfileById", [userId]);
      const userFormatted = await prepare.profile(user);
      Object.assign(postInfo, userFormatted, { id: userId });
      const post = await readPostContract("getPostById", [postId]);
      const totalShared = await readOnchainContract("totalShared", [postId]);
      const postFormatted = await prepare.postOne({ ...post, totalShared });
      Object.assign(postInfo, postFormatted);

      if (account.value.hasAccount) {
        const hasLiked = await readPostContract("hasLiked", [
          postId,
          account.value.wallet,
        ]);
        Object.assign(postInfo, { hasLiked: hasLiked });
      } else {
        Object.assign(postInfo, { hasLiked: false });
      }
      return { success: true, data: postInfo };
    } catch (error) {
      return {
        success: false,
        message: "",
      };
    }
  }

  return { getPost };
};
