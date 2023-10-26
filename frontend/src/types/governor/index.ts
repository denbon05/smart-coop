import type { Member } from '../backend-api';

export interface IProposal {
  title: string;
  description: string;
  cost: string;
  receiver: Member;
}

export type FetchedProposal = Omit<IProposal, 'receiver'> & {
  id: string;
  votedFor: number;
  votedAgainst: number;
  abstain: number;
  receiverAddress: string;
  proposerAddress: string;
  state: string;
  /** Human readable time format */
  voteStart: string;
  /** Human readable time format */
  voteEnd: string;
};
