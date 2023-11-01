import AppError from '@/errors/AppError';
import CoopGovernor from '@abi/CoopGovernor.sol/CoopGovernor.json';
import type { BlockTag } from 'ethers';
import { ethers } from 'ethers';
import moment from 'moment';

export const getProvider = () => {
  if (!window.ethereum) {
    throw new AppError('Connect wallet first');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getCurrentSigner = () => {
  const provider = getProvider();
  return new ethers.JsonRpcSigner(provider, window.ethereum!.selectedAddress!);
};

export const getCoopGovernor = (address: string) => {
  const signer = getCurrentSigner();
  if (!address) {
    throw new AppError('Governor Contract address is not found!');
  }

  return new ethers.Contract(address, CoopGovernor.abi, signer);
};

export const getBlockTime = async (blockTag: BlockTag = 'latest') => {
  const provider = getProvider();
  return provider.getBlock(blockTag).then((block) => {
    if (!block) {
      // estimate time for non-existing block
      return provider.getBlock('latest').then((latestBlock) => {
        const avgTimeInSecondsToMineBlock = 15;
        // the block of `blockTag` is not mined yet
        const blockDiff = Number(blockTag) - latestBlock!.number;
        // convert to ms
        const msDiff = blockDiff * avgTimeInSecondsToMineBlock * 1000;
        return new Date(
          moment()
            .add(
              // adjust to hardhat automine blocks
              moment.duration(
                moment()
                  .subtract(latestBlock!.timestamp * 1000 + msDiff, 'ms')
                  .valueOf()
              )
            )
            .valueOf()
        );
      });
    }
    // multiply by 1000 in order to convert seconds to milliseconds
    return new Date(block.timestamp * 1000);
  });
};
