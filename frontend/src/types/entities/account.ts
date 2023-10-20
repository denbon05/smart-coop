import type Member from '@/entities/Member';
import type { Coop } from '../backend-api';

export enum AccountType {
  COOP,
  MEMBER,
}

export type CoopForm = Omit<Coop, 'id'>;

export type MemberForm = Omit<Member, 'id' | 'coop' | 'isGuest'>;

export type Account<T extends AccountType> = T extends AccountType.COOP
  ? CoopForm
  : MemberForm;

export type CoopMember = Member & {
  coop: Coop;
};
