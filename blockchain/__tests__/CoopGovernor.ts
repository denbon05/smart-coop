import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { finishElectionPeriod } from "./helpers";
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

  it("Governor should expose COOP token address", async () => {
    const { coopGovernor, coopToken } = await loadFixture(deploy);
    const tokenAddress = await coopGovernor.token();
    expect(tokenAddress).eq(coopToken.target);
  });

  it("Deployer has to have voting power", async () => {
    const { s1, coopToken } = await loadFixture(deploy);
    const deployerBalance = await coopToken.balanceOf(s1.address);
    expect(deployerBalance).to.greaterThan(0n);
  });

  describe("With members", () => {
    const ethAmount = 0.5;
    const amountDue = ethers.parseEther(ethAmount.toString());

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
      let calldata: string;

      const payBills = async () => {
        const { s1, s2, s3, s4, coopGovernor, coopToken } = await loadFixture(
          deploy,
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
        calldata = coopGovernor.interface.encodeFunctionData("hireService", [
          s2.address,
          amountETHForService,
        ]);

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
        const serviceCost = 1.0;
        const amountETHForService = ethers.parseEther(serviceCost.toString());

        const propose = async () => {
          const { s1, s2, s3, s4, coopGovernor, coopToken } = await loadFixture(
            payBills,
          );

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
          const { s1, coopGovernor, coopToken, proposalId } = await loadFixture(
            propose,
          );

          const votingDelay = Number(await coopGovernor.votingDelay());
          await time.increase(votingDelay * 2);
          // can cast vote after time passed

          // console.log(
          //   "111111111111",
          //   // await coopGovernor.proposalDeadline(proposalId),
          //   (await coopGovernor.proposalVotes(proposalId)).forVotes,
          //   (await coopGovernor.proposalVotes(proposalId)).abstainVotes,
          //   (await coopGovernor.proposalVotes(proposalId)).againstVotes,
          //   "s1 balance token: ",
          //   await coopToken.balanceOf(s1.address),
          // );
          // console.log(
          //   "has voted",
          //   await coopGovernor.hasVoted(proposalId, s1.address),
          // );

          await expect(
            coopGovernor.connect(s1).castVote(proposalId, VoteKeys.FOR),
          ).to.emit(coopGovernor, "VoteCast");
          // coopGovernor.filters.VoteCast;
          // coopGovernor.filters.Tran;

          // const { forVotes, againstVotes, abstainVotes } =
          //   await coopGovernor.proposalVotes(proposalId);
          // console.log(
          //   "2222222222",
          //   // await coopGovernor.proposalDeadline(proposalId),
          //   {
          //     forVotes,
          //     forVotesETH: ethers.formatEther(forVotes),
          //     againstVotes,
          //     abstainVotes,
          //   },
          // );
        });

        it("Members should not be able to cast votes after election", async () => {
          const { s3, coopGovernor, proposalId } = await loadFixture(propose);

          const proposalDeadline = Number(
            await coopGovernor.proposalDeadline(proposalId),
          );
          await finishElectionPeriod(proposalDeadline);
          // can cast vote after time passed

          await expect(
            coopGovernor.connect(s3).castVote(proposalId, VoteKeys.FOR),
          ).to.reverted;
        });

        describe("Votes casted", () => {
          const castVotes = async () => {
            const { s1, s2, s3, s4, coopGovernor, coopToken, proposalId } =
              await loadFixture(propose);

            const votingPeriod = Number(await coopGovernor.votingPeriod());
            await time.increase(votingPeriod);

            await Promise.all(
              [s1, s4, s3].map((s) =>
                coopGovernor.connect(s).castVote(proposalId, VoteKeys.FOR),
              ),
            );

            return { s1, s2, s3, s4, coopGovernor, coopToken, proposalId };
          };

          it("Should be able to execute the propose", async () => {
            const {
              s2: service,
              coopGovernor,
              proposalId,
            } = await loadFixture(castVotes);

            const proposalDeadline = await coopGovernor.proposalDeadline(
              proposalId,
            );
            await finishElectionPeriod(Number(proposalDeadline));

            const serviceBalanceBefore = Number(
              ethers.formatEther(
                await ethers.provider.getBalance(service.address),
              ),
            );

            await expect(
              coopGovernor.execute(
                [coopGovernor.target],
                [0],
                [calldata],
                ethers.keccak256(ethers.toUtf8Bytes("Pay for service")),
              ),
            ).to.emit(coopGovernor, "ProposalExecuted");

            const serviceBalanceAfter = Number(
              ethers.formatEther(
                await ethers.provider.getBalance(service.address),
              ),
            );

            expect(serviceBalanceBefore + serviceCost).eq(serviceBalanceAfter);
          });
        });
      });
    });
  });
});
