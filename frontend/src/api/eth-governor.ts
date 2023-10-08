import { coopGovernorAddress } from '@/constants';
import AppError from '@/errors/AppError';
import type { GovernorAccount } from '@/types/entities/account';
import { abi as coopGovernorABI } from '@abi/CoopGovernor.sol/CoopGovernor.json';
import { ethers } from 'ethers';

const getCoopGovernor = () => {
  if (!window.ethereum) {
    throw new AppError('Connect wallet first');
  }
  const provider = new ethers.BrowserProvider(window.ethereum);

  const signer = new ethers.JsonRpcSigner(
    provider,
    window.ethereum.selectedAddress!
  );

  return new ethers.Contract(coopGovernorAddress, coopGovernorABI, signer);
};

export const fetchAccountData = async (): Promise<GovernorAccount> => {
  const coopGovernor = getCoopGovernor();

  return coopGovernor.getAccount(window.ethereum!.selectedAddress);
};

export const createAccount = async (accountData: GovernorAccount) => {
  const coopGovernor = getCoopGovernor();

  return coopGovernor.addAccount({
    ...accountData,
    exists: true,
  });
};
