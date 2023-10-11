import AppError from '@/errors/AppError';
import { governorCoopStorage, tokenCoopStorage } from '@/storage/contracts';
import type { GovernorAccount } from '@/types/entities/account';
import CoopGovernor from '@abi/CoopGovernor.sol/CoopGovernor.json';
import CoopToken from '@abi/CoopToken.sol/CoopToken.json';
import { ethers } from 'ethers';

const getProvider = () => {
  if (!window.ethereum) {
    throw new AppError('Connect wallet first');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

const getCurrentSigner = () => {
  const provider = getProvider();
  return new ethers.JsonRpcSigner(provider, window.ethereum!.selectedAddress!);
};

const getCoopGovernor = () => {
  const signer = getCurrentSigner();
  const address = governorCoopStorage.getAddress();
  if (!address) {
    throw new AppError('Governor Contract address is not found!');
  }

  return new ethers.Contract(address, CoopGovernor.abi, signer);
};

const getCoopToken = () => {
  const signer = getCurrentSigner();
  const address = tokenCoopStorage.getAddress();
  if (!address) {
    throw new AppError('Governor Token Contract address is not found!');
  }

  return new ethers.Contract(address, CoopToken.abi, signer);
};

export const deployGovernor = async () => {
  if (!window.ethereum) {
    throw new AppError('Connect wallet first');
  }

  const signer = getCurrentSigner();
  const nonce = await signer.getNonce();

  console.log('deployerAddress', signer.address);

  // compute the future address of the token
  const tokenFutureAddress = ethers.getCreateAddress({
    from: signer.address,
    nonce: nonce + 1,
  });

  console.log('tokenFutureAddress', tokenFutureAddress);

  const coopGovernorFactory = new ethers.ContractFactory(
    CoopGovernor.abi,
    CoopGovernor.bytecode,
    signer
  );
  const coopGovernor = await coopGovernorFactory.deploy(tokenFutureAddress);

  const coopTokenFactory = new ethers.ContractFactory(
    CoopToken.abi,
    CoopToken.bytecode,
    signer
  );
  const coopToken = await coopTokenFactory.deploy(coopGovernor.target);

  // console.log('expected', tokenFutureAddress);
  // console.log('actual', coopToken.target);

  console.log(`CoopGovernor deployed to ${coopGovernor.target}`);
  console.log(`CoopToken deployed to ${coopToken.target}`);
  // save contracts addresses for future use
  governorCoopStorage.setAddress(coopGovernor.target.toString());
  tokenCoopStorage.setAddress(coopToken.target.toString());
};

export const isAccountConnectedToCoop = async (): Promise<boolean> => {
  const governorAddress = governorCoopStorage.getAddress();
  const tokenAddress = tokenCoopStorage.getAddress();

  if (!governorAddress || !tokenAddress) {
    console.warn('Account is not connected to coop');
    return false;
  }

  const coopToken = getCoopToken();

  const accountBalance: bigint = await coopToken.balanceOf(
    window.ethereum!.selectedAddress
  );
  console.log('accountBalance', accountBalance);
  // user has to have voting power
  return accountBalance > 0n;
};

export const joinToCoop = async (accountData: GovernorAccount) => {
  const coopGovernor = getCoopGovernor();

  return coopGovernor.addMember({
    ...accountData,
    isMember: true,
  });
};

// ? let's say the amount due to pay could be constant
export const payBill = async (amountDue = '0.01') => {
  const signer = getCurrentSigner();
  const coopGovernor = getCoopGovernor();

  const value = ethers.parseEther(amountDue);

  return signer.sendTransaction({
    to: coopGovernor.target,
    value,
  });
};

export const makeProposal = async () => {
  const coopGovernor = getCoopGovernor();
  const coopToken = getCoopToken();
  const signer = getCurrentSigner();

  // pay some external service for their services
  const calldata = coopToken.interface.encodeFunctionData('');
};
