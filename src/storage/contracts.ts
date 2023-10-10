// TODO use db
const GOVERNOR_COOP_KEY = 'governorCoop';
const TOKEN_COOP_KEY = 'tokenCoop';

export const governorCoopStorage = {
  getAddress: () => localStorage.getItem(GOVERNOR_COOP_KEY),
  setAddress: (address: string) =>
    localStorage.setItem(GOVERNOR_COOP_KEY, address),
};

export const tokenCoopStorage = {
  getAddress: () => localStorage.getItem(TOKEN_COOP_KEY),
  setAddress: (address: string) =>
    localStorage.setItem(TOKEN_COOP_KEY, address),
};
