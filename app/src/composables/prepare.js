import { useUtils } from "./useUtils.js";
const { formatToNumber } = useUtils();

export const usePrepare = () => {
  async function fetchAndValidateMetadata(url) {
    if (!url.startsWith("https://ipfs.io/ipfs/")) return null;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching metadata");
    const metadata = await response.json();
    return metadata;
  }

  function processProfileData(data, metadata) {
    return {
      banner:
        metadata.banner && metadata.banner.startsWith("https://ipfs.io/ipfs/")
          ? metadata.banner
          : null,
      avatar:
        metadata.avatar && metadata.avatar.startsWith("https://ipfs.io/ipfs/")
          ? metadata.avatar
          : null,
      name: metadata.name,
      description: metadata.description,
      handle: data.handle,
      module: data.followModule,
      hasSubscription: data.hasSubscription,
      following: formatToNumber(data.following),
      followers: formatToNumber(data.followers),
      biography: metadata.biography,
      location: metadata.location,
      createdAt: metadata.created_at,
      links: metadata.links,
    };
  }

  async function postOne(data) {
    const metadata = await fetchAndValidateMetadata(data.metadata);
    if (!metadata) return null;
    return {
      postId: formatToNumber(data.id),
      attachment: metadata.attachment,
      text: metadata.text,
      postCreatedAt: metadata.created_at,
      totalLike: formatToNumber(data.totalLike),
      totalComments: formatToNumber(data.totalComments),
      totalShared: formatToNumber(data.totalShared),
      postModule: data.module,
    };
  }

  async function profile(data) {
    const metadata = await fetchAndValidateMetadata(data.metadata);
    if (!metadata) return null;
    return processProfileData(data, metadata);
  }

  function processPostData(list, author, metadata) {
    return {
      authorName: author.name,
      authorAvatar: author.avatar,
      id: formatToNumber(list.id),
      hasShared: list.shared,
      authorHasSubscription: list.authorHasSubscription,
      authorHandle: list.authorHandle,
      owner: list.owner,
      totalLike: formatToNumber(list.totalLike),
      totalShared: formatToNumber(list.totalShared),
      totalComments: formatToNumber(list.totalComments),
      attachment: metadata.attachment,
      text: metadata.text,
      createdAt: metadata.created_at,
      postModule: list.postModule,
    };
  }

  async function post(data) {    
    const postInfo = [];
    for (const list of data) {
      if (list.owner === "0x0000000000000000000000000000000000000000") continue;

      const [author, metadata] = await Promise.all([
        fetchAndValidateMetadata(list.authorMetadata),
        fetchAndValidateMetadata(list.metadata),
      ]);

      if (author && metadata) {
        postInfo.push(processPostData(list, author, metadata));
      }
    }
    return postInfo.reverse();
  }

  return { profile, post, postOne };
};
