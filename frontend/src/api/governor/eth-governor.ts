import { COOP_HIRE_SERVICE_KEY } from '@/constants';
import AppError from '@/errors/AppError';
import {
  ProposalStatus,
  type CastVoteParams,
  type FetchedProposal,
  type GovernorDetails,
  type HumanProposalState,
  type IProposal,
  type MemberDetails,
  type MemberPaymentHistory,
  type MemberVotingHistory,
  type ProposalDetails,
} from '@/types/governor';
import {
  formatVoteByKey,
  formatVotingWeightToVotesAmount,
  isStatusIncludesProposalState,
  parseProposalDescription,
  proposalStateByEnumValue,
  stringifyProposeDescription,
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
import moment from 'moment';
import { fetchAccounts } from '../server';
import {
  getBlockTime,
  getCoopGovernor,
  getCurrentSigner,
  getProvider,
} from './utils';

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
  const calldata = coopGovernor.interface.encodeFunctionData(
    COOP_HIRE_SERVICE_KEY,
    [receiver.id, priceInWei]
  );

  const tx = await coopGovernor.propose(
    [coopGovernor.target],
    [0],
    [calldata],
    stringifyProposeDescription(title, description)
  );

  return tx.wait();
};

/**
 * @param {string} governorAddress
 * @param {ProposalStatus} proposalStatus There are 2 statuses available
 * 'AVAILABLE' and 'HISTORY'
 */
export const fetchProposals = async (
  governorAddress: string,
  proposalStatus: ProposalStatus = ProposalStatus.AVAILABLE
): Promise<FetchedProposal[]> => {
  // TODO refactor
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

  // console.log('proposalCreatedLogs', proposalCreatedLogs);

  const proposalCreatedEventFilter = coopGovernor.filters.ProposalCreated();
  // console.log('eventFilter', proposalCreatedEventFilter);

  const coopMembers = await fetchAccounts({ coopId: governorAddress });
  const totalAmountOfVotes = coopMembers.length;
  // console.log('############ totalAmountOfVotes', totalAmountOfVotes);

  const formattedProposalsPromise = (proposalCreatedLogs ?? []).reduce<
    Promise<FetchedProposal[]>
  >(async (promiseAcc, log) => {
    const acc = await promiseAcc;
    // console.log('log', log);
    // decode the event log
    const decodedLog = coopGovernor.interface.decodeEventLog(
      proposalCreatedEventFilter.fragment,
      log.data,
      log.topics
    );
    // console.log('decodedLog', decodedLog);
    const {
      proposalId: proposalIdBigint,
      description: descriptionWithTitle,
      proposer: proposerAddress,
    } = decodedLog;

    const proposalId = proposalIdBigint.toString();
    const coopProposalState: bigint = await coopGovernor.state(proposalId);

    // console.log({
    //   proposalStatus,
    //   coopProposalState,
    // });
    if (!isStatusIncludesProposalState(coopProposalState, proposalStatus)) {
      // filter state doesn't match
      return acc;
    }

    // start and end properties are not a Proxy
    // `voteStart` and `voteEnd` indexes are 6 and 7
    // of the ProposalCreated event signature
    const [voteStartUint, voteEndUint] = decodedLog.slice(6, 8);
    const finalDateToVote = await getBlockTime(Number(voteEndUint));
    console.log('!!!!!!!!!!!!!', finalDateToVote);
    const { description, title } =
      parseProposalDescription(descriptionWithTitle);
    // there is only one calldata designed
    const [calldata] = decodedLog.calldatas;
    // console.log('calldata', calldata);
    // 'hireService' the function to execute of the smart-coop
    const [receiverAddress, priceInWei] =
      coopGovernor.interface.decodeFunctionData(
        COOP_HIRE_SERVICE_KEY,
        calldata
      );

    // console.log('proposalStateEnumValue', proposalStateEnumValue);
    const {
      forVotes: forVotesBigint,
      againstVotes: againstVotesBigint,
      abstainVotes: abstainVotesBigint,
    } = await coopGovernor.proposalVotes(proposalId);
    // in order to gain the human readable state
    // obtain the key and cast the type
    const proposalStateKey =
      coopProposalState.toString() as keyof typeof proposalStateByEnumValue;

    const forVotes = formatVotingWeightToVotesAmount(forVotesBigint);
    const againstVotes = formatVotingWeightToVotesAmount(againstVotesBigint);
    const abstainVotes = formatVotingWeightToVotesAmount(abstainVotesBigint);

    console.log({
      voteEndUint,
      voteStartUint,
      eventBlockNum: log.blockNumber,
    });
    const voteEndFormatted =
      proposalStatus === ProposalStatus.HISTORY
        ? moment(finalDateToVote).format('DD/MM/YY HH:mm')
        : moment(finalDateToVote).fromNow();

    return [
      ...acc,
      {
        id: proposalId,
        cost: formatEther(priceInWei),
        receiverAddress,
        description,
        title,
        proposerAddress,
        state: proposalStateByEnumValue[proposalStateKey] as HumanProposalState,
        forVotes,
        againstVotes,
        /** always show abstained votes */
        abstainVotes:
          abstainVotes || totalAmountOfVotes - (forVotes + againstVotes),
        // todo format the time
        // voteEnd: `${moment(finalDateToVote).fromNow(true)} (${
        //   Number(voteEndUint) - log.blockNumber
        // } blocks)`,
        voteEnd: voteEndFormatted,
        voteStart: voteStartUint,
        logData: log.data,
      },
    ];
  }, Promise.resolve([]));

  const formattedProposals: FetchedProposal[] = await formattedProposalsPromise;

  return formattedProposals;
};

export const fetchProposalDetails = async (
  governorAddress: string,
  proposalId: string
): Promise<ProposalDetails> => {
  const signer = getCurrentSigner();
  const coopGovernor = getCoopGovernor(governorAddress);

  const hasAddressVoted = await coopGovernor.hasVoted(
    proposalId,
    signer.address
  );

  return {
    hasAddressVoted,
  };
};

export const fetchGovernorDetails = async (
  governorAddress: string
): Promise<GovernorDetails> => {
  // const coopGovernor = getCoopGovernor(governorAddress);
  const provider = getProvider();

  const balanceInWei = await provider.getBalance(governorAddress);

  return {
    balanceInEth: ethers.formatEther(balanceInWei),
  };
};

export const fetchMemberDetails = async (
  governorAddress: string
): Promise<MemberDetails> => {
  const provider = getProvider();
  const signer = getCurrentSigner();
  const coopGovernor = getCoopGovernor(governorAddress);
  const coopToken = await getCoopToken(coopGovernor);

  const balanceInWei = await provider.getBalance(signer.address);
  const tokenBalanceInWei = await coopToken.balanceOf(signer.address);

  return {
    balanceInEth: ethers.formatEther(balanceInWei),
    votingPower: tokenBalanceInWei.toString(),
    votesAmount: formatVotingWeightToVotesAmount(tokenBalanceInWei),
  };
};

export const fetchMemberVotingHistory = async (
  governorAddress: string
): Promise<MemberVotingHistory> => {
  // TODO limit the searching range
  const fromBlock = '0x0';
  const toBlock = 'latest';

  const provider = getProvider();
  const signer = getCurrentSigner();
  const coopGovernor = getCoopGovernor(governorAddress);

  const voteCastHash = keccak256(
    toUtf8Bytes('VoteCast(address,uint256,uint8,uint256,string)')
  );
  const zeroPaddedSignerAddress = ethers.zeroPadValue(signer.address, 32);
  const voteCastFilter = coopGovernor.filters.VoteCast(signer.address);
  const voteCastLogs = await provider.getLogs({
    address: coopGovernor.target.toString(),
    topics: [voteCastHash, zeroPaddedSignerAddress],
    fromBlock,
    toBlock,
  });

  return voteCastLogs.map((log) => {
    const [, proposalIdBigint, supportBigint] =
      coopGovernor.interface.decodeEventLog(
        voteCastFilter.fragment,
        log.data,
        log.topics
      );
    return {
      proposalId: proposalIdBigint.toString(),
      decision: formatVoteByKey(supportBigint),
    };
  });
};

export const fetchMemberPaymentHistory = async (
  governorAddress: string
): Promise<MemberPaymentHistory[]> => {
  // TODO limit the searching range
  const fromBlock = '0x0';
  const toBlock = 'latest';

  const provider = getProvider();
  const signer = getCurrentSigner();
  const coopGovernor = getCoopGovernor(governorAddress);

  const paymentHash = keccak256(
    toUtf8Bytes('PaymentReceived(address,uint256)')
  );

  const zeroPaddedSignerAddress = ethers.zeroPadValue(signer.address, 32);
  const paymentReceivedFilter = coopGovernor.filters.PaymentReceived(
    signer.address
  );
  const paymentLogs = await provider.getLogs({
    address: coopGovernor.target.toString(),
    topics: [paymentHash, zeroPaddedSignerAddress],
    fromBlock,
    toBlock,
  });
  // console.log('paymentLogs', paymentLogs);
  // console.log('paymentReceivedFilter', paymentReceivedFilter.fragment);

  // reverse logs in order to have earliest first
  const paymentPromises = paymentLogs.reverse().map(async (log) => {
    const date = await getBlockTime(log.blockNumber);
    const [, amountInWei] = coopGovernor.interface.decodeEventLog(
      paymentReceivedFilter.fragment,
      log.data,
      log.topics
    );
    return {
      localTime: date.toLocaleString(),
      amountInEth: ethers.formatEther(amountInWei),
    };
  });

  return Promise.all(paymentPromises);
};

export const castVote = async ({
  governorAddress,
  proposalId,
  voteKey,
}: CastVoteParams) => {
  const signer = getCurrentSigner();
  const coopGovernor = getCoopGovernor(governorAddress);
  const coopToken = await getCoopToken(coopGovernor);

  // delegate voting power to user himself
  await coopToken.delegate(signer.address);
  // cast the selected vote
  // @ts-ignore
  await coopGovernor.connect(signer).castVote(proposalId, voteKey);
};

export const executeProposal = async (
  governorAddress: string,
  proposal: FetchedProposal
) => {
  const coopGovernor = getCoopGovernor(governorAddress);

  // encrypt in the same way as during making proposal
  const proposalDescription = stringifyProposeDescription(
    proposal.title,
    proposal.description
  );
  const descriptionHash = keccak256(toUtf8Bytes(proposalDescription));

  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const decodedData = abiCoder.decode(
    [
      'uint256',
      'address',
      'address[]',
      'uint256[]',
      'string[]',
      'bytes[]',
      'uint256',
      'uint256',
      'string',
    ],
    proposal.logData
  );
  // 5 is an index of calldatas topic/argument of `ProposalCreated` event
  const [calldata] = decodedData.at(5);

  const tx = await coopGovernor.execute(
    [coopGovernor.target],
    [0],
    [calldata],
    descriptionHash
  );
  return tx.wait();
};
