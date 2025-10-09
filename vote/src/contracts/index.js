import { zeroAddress } from "viem";
import PostNFT from "./PostNFT.js";
import ProfileGovernance from "./ProfileGovernance.js";
import ProfileNFT from "./ProfileNFT.js";
import Onchain from "./Onchain.js";
import Token from "./Token.js";
import UserReportManager from "./UserReportManager.js";

export const contract = {
  PostNFT: '0xC24dE0dF9e0eeCcA78C5964d848fab4E810D659f',
  ProfileGovernance: '0xBF302e24c773D2dF728555d9D4ae62492B05519b',
  ProfileNFT: '0xB11e64319f50209B718AFd7A81584d1BEa3F1F9b',
  Onchain: '0x185f52834BE7Dba14f8EfDf279d87bCD010c320D',
  Token: '0x6Dc82C447dCCE2cE75304b72F26Eb32091B17e08',
  UserReportManager: '0xE93F5508a853896b8b2018D8541583e750041529',
  PaidFollowModule: '0xA975750CcE5DD906Ce100C2b625e3cC6ffbAa5db',
  FollowerOnlyPostModule: '0x0F81ab7BDfbce3F64D4B564840fA9627cdE04e66',
  ZeroAddress: zeroAddress,
}

export const abi = {
  PostNFT,
  ProfileGovernance,
  ProfileNFT,
  Onchain,
  Token,
  UserReportManager,
};
