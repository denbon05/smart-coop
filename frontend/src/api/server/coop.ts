import type { Coop } from '@/types/backend-api';
import { axios } from './_config';

export const createCoop = async (coop: Coop) => {
  const { data } = await axios.post('coop', coop);
  return data;
};
