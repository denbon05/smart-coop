import {
  ProposalState,
  ProposalStatus,
  VoteKeys,
  type VoteFormatted,
} from '@/types/governor';
import { ethers } from 'ethers';

export const stringifyProposeDescription = (
  title: string,
  description: string
) => `${title}\n${description}`;

export const parseProposalDescription = (proposalDescription: string) => {
  const [title, ...rest] = proposalDescription.split('\n');
  return {
    title,
    description: rest.join('\n'),
  };
};

export const formatVotingWeightToVotesAmount = (votingWeight: bigint) =>
  Math.round(Number(ethers.formatEther(votingWeight)));

/** IGovernor human readable proposal state */
export const proposalStateByEnumValue = {
  '0': 'Pending',
  '1': 'Active',
  '2': 'Canceled',
  '3': 'Defeated',
  '4': 'Succeeded',
  '5': 'Queued',
  '6': 'Expired',
  '7': 'Executed',
} as const;

export const formatVoteByKey = (voteKey: bigint): VoteFormatted => {
  const voteEnumKey = Number(voteKey);

  if (voteEnumKey === VoteKeys.ABSTAIN) {
    return 'ABSTAIN';
  }

  return voteEnumKey === VoteKeys.FOR ? 'FOR' : 'AGAINST';
};

export const isStatusIncludesProposalState = (
  coopProposalState: bigint,
  proposalStatus: ProposalStatus
): boolean => {
  const availableStates = new Set([
    ProposalState.Active,
    ProposalState.Pending,
  ]);
  const coopProposalStateNum = Number(coopProposalState);

  return proposalStatus === ProposalStatus.AVAILABLE
    ? availableStates.has(coopProposalStateNum)
    : !availableStates.has(coopProposalStateNum);
};
