import type { Member } from '@/types/backend-api';
import type { CoopMember } from '@/types/entities/account';
import { axios } from './_config';

export const joinCoop = async (member: Member) => {
  const { data } = await axios.post('/member', member);
  return data;
};

export const fetchMember = async (id: string): Promise<CoopMember | null> => {
  const { data } = await axios.get<CoopMember | null>('/member', {
    params: { id },
  });
  return data;
};

export const fetchAccounts = async (params: { coopId: string }) => {
  const { data } = await axios.get<Member[]>('/members', { params });
  return data;
};
