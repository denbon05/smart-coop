import type { Coop } from '@/types/backend-api';
import type { FetchedCoop } from '@/types/server/cooperatives';
import { axios } from './_config';

export const addCoop = async (coop: Coop): Promise<Coop> => {
  const { data } = await axios.post('coop', coop);
  return data;
};

export const searchCoop = async (value: string): Promise<Coop[]> => {
  const { data } = await axios.get('/coops', { params: { value } });
  return data;
};

export const fetchCoop = async (id: string): Promise<FetchedCoop> => {
  const { data } = await axios.get('/coop', { params: { id } });
  return data;
};
