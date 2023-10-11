import {
  // time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("CoopGovernor", function () {
  const deploy = async () => {
    const [s1, s2, s3, s4, s5] = await ethers.getSigners();
    const Governor = await ethers.getContractFactory("CoopGovernor");
    const Token = await ethers.getContractFactory("CoopToken");
    const nonce = await s1.getNonce();

    const futureTokenAddress = ethers.getCreateAddress({
      from: s1.address,
      nonce: nonce + 1, // get next nonce
    });

    const coopGovernor = await Governor.deploy(futureTokenAddress);
    const coopToken = await Token.deploy(coopGovernor.target);

    return { s1, s2, s3, s4, s5, coopGovernor, coopToken };
  };

  it("Deployer has to have voting power", async () => {
    const { s1, coopToken } = await loadFixture(deploy);
    const deployerBalance = await coopToken.balanceOf(s1.address);
    expect(deployerBalance).to.greaterThan(0n);
  });

  it("Should be possible to join smart-coop", async () => {
    const { s2, coopGovernor, coopToken } = await loadFixture(deploy);
    await coopGovernor.connect(s2).join();
    const memberBalance = await coopToken.balanceOf(s2.address);
    expect(memberBalance).to.greaterThan(0n);
  });

  describe("With members", () => {
    const ethAmount = 0.01;
    const amountDue = ethers.parseEther(ethAmount.toString());

    beforeEach(async () => {
      const { s2, s3, s4, coopGovernor } = await loadFixture(deploy);
      // add some members
      await Promise.all(
        [s2, s3, s4].map((signer) => coopGovernor.connect(signer).join()),
      );
    });

    it("Members should be able to pay their bills", async () => {
      const { s1, s2, s3, coopGovernor } = await loadFixture(deploy);
      const members = [s1, s2, s3];
      // pay bills
      await Promise.all(
        members.map((member) =>
          member.sendTransaction({
            to: coopGovernor.target,
            value: amountDue,
          }),
        ),
      );

      const governorETHBalance = await ethers.provider.getBalance(
        coopGovernor.target,
      );
      const actualGovernorETHBalance = ethers.formatEther(governorETHBalance);
      const expectedGovernorETHBalance = (
        ethAmount * members.length
      ).toString();
      expect(actualGovernorETHBalance).eq(expectedGovernorETHBalance);
    });

    describe("With ETH on balance", () => {
      beforeEach(async () => {
        const governorETHBalance = ethers.parseEther("5");
        const { s1, coopGovernor } = await loadFixture(deploy);
        // top up the Governor contract balance
        await s1.sendTransaction({
          to: coopGovernor.target,
          value: governorETHBalance,
        });
      });

      it("Member should be able to make a proposal", async () => {
        const { s2, coopGovernor, coopToken } = await loadFixture(deploy);
        const amountETHForService = ethers.parseEther("1.0");
        const calldata = coopGovernor.interface.encodeFunctionData(
          "hireService",
          [s2.address, amountETHForService],
        );
        // TODO fix GovernorInsufficientProposerVotes
        await coopGovernor.propose(
          [coopGovernor.target],
          [0],
          [calldata],
          "Pay for service",
        );
      });
    });
  });
});
