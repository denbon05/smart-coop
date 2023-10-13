import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { VoteKeys } from "./types/governor";

describe("CoopGovernor", function () {
  const deploy = async () => {
    const [s1, s2, s3, s4] = await ethers.getSigners();
    const Governor = await ethers.getContractFactory("CoopGovernor");
    const Token = await ethers.getContractFactory("CoopToken");
    const nonce = await s1.getNonce();

    const futureTokenAddress = ethers.getCreateAddress({
      from: s1.address,
      nonce: nonce + 1, // get next nonce
    });

    const coopGovernor = await Governor.deploy(futureTokenAddress);
    const coopToken = await Token.deploy(coopGovernor.target);

    return { s1, s2, s3, s4, coopGovernor, coopToken };
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

    const joinToCoop = async () => {
      const { s1, s2, s3, s4, coopGovernor, coopToken } = await loadFixture(
        deploy,
      );
      // add some members
      await Promise.all(
        [s2, s3, s4].map((signer) => coopGovernor.connect(signer).join()),
      );

      return { s1, s2, s3, s4, coopGovernor, coopToken };
    };

    it("Members should be able to pay their bills", async () => {
      const { s1, s2, s3, coopGovernor } = await loadFixture(joinToCoop);
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
      const payBills = async () => {
        const { s1, s2, s3, s4, coopGovernor, coopToken } = await loadFixture(
          joinToCoop,
        );

        // members pay their bills
        await Promise.all(
          [s1, s1, s2, s3, s4].map((s) =>
            s.sendTransaction({
              to: coopGovernor.target,
              value: amountDue,
            }),
          ),
        );

        return { s1, s2, s3, s4, coopGovernor, coopToken };
      };

      it("Member should be able to make a proposal", async () => {
        const { s1, s2, coopGovernor, coopToken } = await loadFixture(payBills);
        const amountETHForService = ethers.parseEther("1.0");
        const calldata = coopGovernor.interface.encodeFunctionData(
          "hireService",
          [s2.address, amountETHForService],
        );

        // delegate member voting power to himself
        await coopToken.delegate(s1.address);

        await expect(
          coopGovernor.propose(
            [coopGovernor.target],
            [0],
            [calldata],
            "Pay for service",
          ),
        ).to.emit(coopGovernor, "ProposalCreated");
      });

      describe("Cast vote", () => {
        let calldata: string;

        const propose = async () => {
          const { s1, s2, s3, s4, coopGovernor, coopToken } = await loadFixture(
            payBills,
          );

          const amountETHForService = ethers.parseEther("1.0");
          calldata = coopGovernor.interface.encodeFunctionData("hireService", [
            s2.address,
            amountETHForService,
          ]);

          // delegate member voting power to himself
          await coopToken.delegate(s1.address);

          const tx = await coopGovernor.propose(
            [coopGovernor.target],
            [0],
            [calldata],
            "Pay for service",
          );

          const receipt = await tx.wait();
          // @ts-ignore
          const [
            {
              args: { proposalId: proposalIdBigint },
            },
          ] = receipt?.logs;
          const proposalId: string = proposalIdBigint.toString();

          return { s1, s2, s3, s4, coopGovernor, coopToken, proposalId };
        };

        it("Members should be able to cast votes", async () => {
          const { s3, coopGovernor, proposalId } = await loadFixture(propose);

          const votingDelay = Number(await coopGovernor.votingDelay());
          await time.increase(votingDelay * 2);
          // can cast vote after time passed

          await expect(
            coopGovernor.connect(s3).castVote(proposalId, VoteKeys.FOR),
          ).to.emit(coopGovernor, "VoteCast");
        });
      });
    });
  });
});
