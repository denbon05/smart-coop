import type { FetchedProposal } from '@/types/governor';
import { reactive } from 'vue';

// selected proposal for global access
const proposal: FetchedProposal = reactive({
  id: '',
  votedFor: 0,
  votedAgainst: 0,
  abstain: 0,
  receiverAddress: '',
  proposerAddress: '',
  state: '',
  voteStart: '',
  voteEnd: '',
  cost: '',
  description: '',
  title: '',
});

export const useProposal = () => ({
  proposal,
  set: (data: FetchedProposal) => Object.assign(proposal, data),
});
