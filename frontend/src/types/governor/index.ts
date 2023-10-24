import type { Member } from '../backend-api';

export interface IProposal {
  title: string;
  description: string;
  cost: string;
  receiver: Member;
}
