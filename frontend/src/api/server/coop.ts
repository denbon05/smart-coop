import type { Coop } from '@/types/backend-api';
import { axios } from './_config';

export const addCoop = async (coop: Coop): Promise<Coop> => {
  const { data } = await axios.post('coop', coop);
  return data;
};

export const searchCoop = async (value: string): Promise<Coop[]> => {
  const { data } = await axios.get('/coops', { params: { value } });
  return data;
};

// todo API
export const fetchCoop = async (id: string): Promise<Coop> => {
  const { data } = await axios.get('/coop', { params: { id } });
  return data;
};
