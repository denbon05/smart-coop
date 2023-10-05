import { coopGovernorAddress } from '@/constants';
import AppError from '@/errors/AppError';
import { abi as coopGovernorABI } from '@abi/CoopGovernor.sol/CoopGovernor.json';
import { JsonRpcSigner, ethers } from 'ethers';

export const connectToWallet = async () => {
  if (!window.ethereum) {
    // handle exception above
    throw new AppError(`
      Can't find Metamask installed.
      Only Metamask is currently supported.
    `);
  }
  // Connect to the MetaMask EIP-1193 object. This is a standard
  // protocol that allows Ethers access to make all read-only
  // requests through MetaMask.
  const provider = new ethers.BrowserProvider(window.ethereum);

  // It also provides an opportunity to request access to write
  // operations, which will be performed by the private key
  // that MetaMask manages for the user.
  const signer = await provider.getSigner();

  return signer;
};

export const fetchAccountData = async (signer: JsonRpcSigner) => {
  if (!window.ethereum) {
    throw new AppError('Connect wallet first');
  }

  const coopGovernor = new ethers.Contract(
    coopGovernorAddress,
    coopGovernorABI,
    signer
  );

  return coopGovernor.getAccount(window.ethereum.selectedAddress);
};
