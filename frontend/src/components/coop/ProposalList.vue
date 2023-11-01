<script setup lang="ts">
import { fetchProposals } from '@/api/governor/eth-governor';
import { useAuth } from '@/composables/auth';
import { useProposal } from '@/composables/proposal';
import type { ShowSnackbar } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import { ProposalStatus, type FetchedProposal } from '@/types/governor';
import { computed, inject, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);
const shouldHistoryBeShown = computed(
  () => route.name === RouteNames.PROPOSAL_HISTORY
);

const shouldFetchProposals = computed(
  () =>
    route.name === RouteNames.PROPOSALS ||
    route.name === RouteNames.PROPOSAL_HISTORY
);

const proposals = ref<FetchedProposal[]>([]);

watchEffect(async () => {
  if (shouldFetchProposals.value) {
    const proposalStatusToFetch: ProposalStatus = shouldHistoryBeShown.value
      ? ProposalStatus.HISTORY
      : ProposalStatus.AVAILABLE;
    fetchProposals(auth.user.coopId, proposalStatusToFetch)
      .then((fetchedProposals) => {
        proposals.value = fetchedProposals;
      })
      .catch((err) => {
        console.error(err);
        showSnackbar({ msg: 'Failed to fetch the proposals' });
      });
  }
});

const proposal = useProposal();

const discoverProposal = (selectedProposal: FetchedProposal) => {
  proposal.set(selectedProposal);
  router.push({
    name: RouteNames.PROPOSAL_DISCOVER,
    params: { proposalAddress: selectedProposal.id },
  });
};
</script>

<template>
  <template v-if="shouldFetchProposals">
    <v-row v-if="proposals.length"
      ><v-col>
        <v-table density="comfortable" fixed-header height="400">
          <thead id="proposalTHead" class="bg-green-darken-3" :elevation="2">
            <tr>
              <th class="text-left text-white w-50 text-subtitle-1">
                PROPOSALS
              </th>
              <th class="text-center text-white text-subtitle-1">YES</th>
              <th class="text-center text-white text-subtitle-1">NO</th>
              <th class="text-center text-white text-subtitle-1">NOT VOTED</th>
              <th class="text-right text-white text-subtitle-1">END TIME</th>
            </tr>
          </thead>
          <div class="my-3"></div>
          <tbody>
            <tr v-for="proposal in proposals" :key="proposal.id">
              <td @click="discoverProposal(proposal)" class="cursor-pointer">
                {{ proposal.title }}
              </td>
              <td align="center">{{ proposal.forVotes }}</td>
              <td align="center">{{ proposal.againstVotes }}</td>
              <td align="center">{{ proposal.abstainVotes }}</td>
              <td align="right">{{ proposal.voteEnd }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col></v-row
    >
    <h4 v-else class="text-center pa-5">There are no available proposals</h4>
  </template>

  <RouterView />
</template>

<style lang="scss" scoped>
#proposalTHead {
  box-shadow: 0 0px 5px rgba(18, 18, 18, 0.598);
}
</style>
