import type { Member } from '@/types/backend-api';
import { axios } from './_config';

export const joinCoop = async (member: Member) => {
  const { data } = await axios.post('/member', member);
  return data;
};
