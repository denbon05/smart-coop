import AppError from '@/errors/AppError';
import type { IProposal } from '@/types/governor';
import { makeProposeDescription } from '@/utils/governor';
import CoopGovernor from '@abi/CoopGovernor.sol/CoopGovernor.json';
import CoopToken from '@abi/CoopToken.sol/CoopToken.json';
import type { Contract } from 'ethers';
import { ethers, parseEther } from 'ethers';

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

const getCoopGovernor = (address: string) => {
  const signer = getCurrentSigner();
  if (!address) {
    throw new AppError('Governor Contract address is not found!');
  }

  return new ethers.Contract(address, CoopGovernor.abi, signer);
};

/**
 * Transfer specific amount to governor contract.
 * @param address Coop governor address
 * @param dueAmount Amount to pay in ETH
 */
export const payBill = async (address: string, dueAmount = '0.2') => {
  const signer = getCurrentSigner();
  const coopGovernor = getCoopGovernor(address);
  return signer.sendTransaction({
    to: coopGovernor.target,
    value: parseEther(dueAmount),
  });
};

const getCoopToken = async (coopGovernor: Contract) => {
  const signer = getCurrentSigner();
  const address = await coopGovernor.token();
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
  // governorCoopStorage.setAddress(coopGovernor.target.toString());
  // tokenCoopStorage.setAddress(coopToken.target.toString());
  return coopGovernor.target;
};

export const joinCoopGovernor = async (governorAddress: string) => {
  const coopGovernor = getCoopGovernor(governorAddress);

  return coopGovernor.join();
};

export const makeProposal = async (
  governorAddress: string,
  { title, description, cost: priceInETH, receiver }: IProposal
) => {
  const coopGovernor = getCoopGovernor(governorAddress);
  const coopToken = await getCoopToken(coopGovernor);
  const signer = getCurrentSigner();

  // delegate member voting power to himself
  await coopToken.delegate(await signer.getAddress());

  const priceInWei = parseEther(priceInETH);
  // pay some external service for their services
  const calldata = coopGovernor.interface.encodeFunctionData('hireService', [
    receiver.id,
    priceInWei,
  ]);

  return coopGovernor.propose(
    [coopGovernor.target],
    [0],
    [calldata],
    makeProposeDescription(title, description)
  );
};
