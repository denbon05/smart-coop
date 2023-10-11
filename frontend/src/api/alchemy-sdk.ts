import { Network, Alchemy, type AlchemySettings } from 'alchemy-sdk';

const settings: AlchemySettings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

export default new Alchemy(settings);
