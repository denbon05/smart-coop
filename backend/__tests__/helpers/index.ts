import { mineUpTo } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

export const finishElectionPeriod = async (proposalDeadline: number) => {
  const blockNum = await ethers.provider.getBlockNumber();
  // compute amount of blocks needed to set the proposal state
  const blockNumAllowedExecution =
    blockNum + (Number(proposalDeadline) * 60) / 15;
  // mine blocks up to allowed execution one
  await mineUpTo(blockNumAllowedExecution);
};
