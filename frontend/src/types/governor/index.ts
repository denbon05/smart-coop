import type { proposalStateByEnumValue } from '@/utils/governor';
import type { Member } from '../backend-api';
import type { ObjectValues } from '../utils';

export interface IProposal {
  title: string;
  description: string;
  cost: string;
  receiver: Member;
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export enum ProposalStatus {
  AVAILABLE,
  HISTORY,
}

/**
 * There are 2 standard keys: support and quorum . support=bravo refers to the
 * vote options 0 = Against, 1 = For, 2 = Abstain, as in GovernorBravo .
 * quorum=bravo means that only For votes are counted towards quorum.
 * quorum=for,abstain means that both For and Abstain votes are counted towards quorum.
 */
export enum VoteKeys {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

/** Human readable vote decisions */
export type VoteFormatted = keyof typeof VoteKeys;

export type Votes = {
  forVotes: number;
  abstainVotes: number;
  againstVotes: number;
};

export type FetchedProposal = Omit<IProposal, 'receiver'> & {
  id: string;
  receiverAddress: string;
  proposerAddress: string;
  state: string;
  /** Human readable time format */
  voteStart: string;
  /** Human readable time format */
  voteEnd: string;
  logData: string;
} & Votes;

export type HumanProposalState = ObjectValues<typeof proposalStateByEnumValue>;

export type ProposalDetails = {
  hasAddressVoted: boolean;
};

export type GovernorDetails = {
  balanceInEth: string;
};

export type MemberDetails = {
  balanceInEth: string;
  votingPower: string;
  votesAmount: number;
};

export type CastVoteParams = {
  governorAddress: string;
  proposalId: string;
  voteKey: VoteKeys;
};

export type MemberVotingHistoryItem = {
  proposalId: string;
  decision: VoteFormatted;
};

export type MemberVotingHistory = MemberVotingHistoryItem[];

export type MemberPaymentHistory = {
  localTime: string;
  amountInEth: string;
};
