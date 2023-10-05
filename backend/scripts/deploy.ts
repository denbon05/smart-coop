import { ethers } from "hardhat";

async function main() {
  const CoopGovernor = await ethers.getContractFactory("CoopGovernor");
  const coopGovernor = await CoopGovernor.deploy();

  console.log(`CoopGovernor deployed to ${coopGovernor.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
