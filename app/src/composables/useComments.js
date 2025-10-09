import { useUtils } from "./useUtils.js";
import { useReadPostContract } from "./useReadPostContract.js";
import { useReadProfileContract } from "./useReadProfileContract.js";
import { useReadOnchainContract } from "./useReadOnchainContract.js";
const { formatToNumber } = useUtils();
const { readProfileContract } = useReadProfileContract();
const { readPostContract } = useReadPostContract();
const { readOnchainContract } = useReadOnchainContract();

export const useComments = () => {
  async function getComments(id, cursor, size) {
    try {
      const [comments, newCursor] = await readPostContract("fetchComments", [
        id,
        cursor,
        size,
      ]);
      if (comments.length == 0) return { success: true, data: [], cursor: 0 };
      const data = [];
      for (const comment of comments) {
        const url = comment.metadata;
        if (!url.startsWith("https://ipfs.io/ipfs/")) continue;
        const response = await fetch(url);
        const metadataPost = await response.json();
        let userInfo;
        try {
          userInfo = await readOnchainContract("getUserByAddress", [
            comment.user,
          ]);
        } catch (_) {
          continue;
        }
        const userId = formatToNumber(userInfo[0]);
        const user = await readProfileContract("getProfileById", [userId]);
        if (!user.metadata.startsWith("https://ipfs.io/ipfs/")) continue;
        const responseProfile = await fetch(user.metadata);
        const metadataProfile = await responseProfile.json();
        data.push({
          text: metadataPost.text,
          createdAt: metadataPost.created_at,
          authorName: metadataProfile.name,
          authorAvatar: metadataProfile.avatar,
          account: comment.user,
        });
      }

      return {
        success: true,
        data: data,
        cursor: formatToNumber(newCursor),
      };
    } catch (error) {
      return {
        success: false,
        message: "",
      };
    }
  }

  return { getComments };
};
