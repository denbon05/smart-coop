import AppError from '@/errors/AppError';
import { type FetchedProposal, type IProposal } from '@/types/governor';
import {
  makeProposeDescription,
  parseProposalDescription,
  proposalStateByEnumValue,
} from '@/utils/governor';
import CoopGovernor from '@abi/CoopGovernor.sol/CoopGovernor.json';
import CoopToken from '@abi/CoopToken.sol/CoopToken.json';
import type { Contract } from 'ethers';
import {
  ethers,
  formatEther,
  keccak256,
  parseEther,
  toUtf8Bytes,
} from 'ethers';

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

  const tx = await coopGovernor.propose(
    [coopGovernor.target],
    [0],
    [calldata],
    makeProposeDescription(title, description)
  );
  const receipt = await tx.wait();

  console.log('!!!!!!', receipt);
  return tx;
};

export const fetchProposals = async (
  governorAddress: string
): Promise<FetchedProposal[]> => {
  const provider = getProvider();

  // todo compute actually needed range of blocks
  const fromBlock = '0x0';
  const toBlock = 'latest';

  const coopGovernor = getCoopGovernor(governorAddress);
  const proposalCreatedHash = keccak256(
    toUtf8Bytes(
      'ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)'
    )
  );

  const proposalCreatedLogs = await provider.getLogs({
    address: coopGovernor.target.toString(),
    topics: [proposalCreatedHash],
    fromBlock,
    toBlock,
  });

  console.log('proposalCreatedLogs', proposalCreatedLogs);

  const proposalCreatedEventFilter = coopGovernor.filters.ProposalCreated();
  console.log('eventFilter', proposalCreatedEventFilter);

  const formattedProposalsPromises = (proposalCreatedLogs ?? []).map<
    Promise<FetchedProposal>
  >(async (log) => {
    // decode the event log
    const decodedLog = coopGovernor.interface.decodeEventLog(
      proposalCreatedEventFilter.fragment,
      log.data,
      log.topics
    );
    console.log('decodedLog', decodedLog);
    const {
      proposalId: proposalIdBigint,
      description: descriptionWithTitle,
      proposer: proposerAddress,
    } = decodedLog;
    // start and end properties are not a Proxy
    // `voteStart` and `voteEnd` indexes are 6 and 7
    // of the ProposalCreated event signature
    const [voteEndUint, voteStartUint] = decodedLog.slice(6, 8);
    const { description, title } =
      parseProposalDescription(descriptionWithTitle);
    // there is only one calldata designed
    const [calldata] = decodedLog.calldatas;
    console.log('calldata', calldata);
    // 'hireService' the function to execute of the smart-coop
    const [receiverAddress, priceInWei] =
      coopGovernor.interface.decodeFunctionData('hireService', calldata);
    const proposalId = proposalIdBigint.toString();
    const proposalStateEnumValue: bigint = await coopGovernor.state(proposalId);
    // console.log(
    //   '!!!!!!!!!1 state',
    //   proposalStateByEnumValue[proposalStateEnumValue.toString()]
    // );
    // in order to gain the human readable state
    // obtain the key and cast the type
    const proposalStateKey =
      proposalStateEnumValue.toString() as keyof typeof proposalStateByEnumValue;

    return {
      id: proposalId,
      cost: formatEther(priceInWei),
      receiverAddress,
      description,
      title,
      proposerAddress,
      state: proposalStateByEnumValue[proposalStateKey],
      votedAgainst: 0,
      votedFor: 0,
      abstain: 0,
      // todo format the time
      voteEnd: voteEndUint,
      voteStart: voteStartUint,
    };
  });

  // ? compute the votes of the proposals

  const voteCastHash = keccak256(
    toUtf8Bytes('VoteCast(address,uint256,uint8,uint256,string)')
  );
  const voteCastLogs = await provider.getLogs({
    address: coopGovernor.target.toString(),
    topics: [voteCastHash],
    fromBlock,
    toBlock,
  });
  const voteCastEventFilter = coopGovernor.filters.VoteCast();

  console.log('\n\n ------------ BEGIN');
  (voteCastLogs ?? []).map((log) => {
    const decodedLog = coopGovernor.interface.decodeEventLog(
      voteCastEventFilter.fragment,
      log.data,
      log.topics
    );
    console.log('decodedLog', decodedLog);
  });
  console.log('\n\n ----------------END');

  const formattedProposals: FetchedProposal[] = await Promise.all(
    formattedProposalsPromises
  );

  return formattedProposals;
};
