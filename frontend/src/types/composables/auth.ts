import type { CoopMember } from '../entities/account';

export interface IAuth {
  selectedAddress: string | null;
  user: CoopMember;
  isLoading: boolean;
}
