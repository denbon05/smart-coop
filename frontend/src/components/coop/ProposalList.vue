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
        <table id="proposalTable" density="comfortable" fixed-header>
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
          <div class="my-4"></div>
          <tbody>
            <tr v-for="proposal in proposals" :key="proposal.id">
              <td
                @click="discoverProposal(proposal)"
                class="cursor-pointer text-decoration-underline"
              >
                {{ proposal.title }}
              </td>
              <td align="center">{{ proposal.forVotes }}</td>
              <td align="center">{{ proposal.againstVotes }}</td>
              <td align="center">{{ proposal.abstainVotes }}</td>
              <td align="right">{{ proposal.voteEnd }}</td>
            </tr>
          </tbody>
        </table>
      </v-col></v-row
    >
    <h4 v-else class="text-center pa-5">There are no available proposals</h4>
  </template>

  <RouterView />
</template>

<style lang="scss" scoped>
// #proposalTHead {
//   background-color: green !important;
//   box-shadow: 0 0px 5px rgba(18, 18, 18, 0.598);
// }

// #proposalTHead::before {
//   content: '' !important;
//   display: table !important;
//   background-color: lightblue !important;
//   width: 100% !important; /* Set the desired width */
//   position: absolute !important;
//   top: 0 !important;
//   left: 0 !important;
//   z-index: -1 !important;
// }

#proposalTHead {
  border-radius: 5px !important;
  box-shadow: 0 1px 5px rgba(18, 18, 18, 0.598);
  th {
    padding: 10px 15px;
  }
}

#proposalTable {
  width: 100%;
  border-collapse: collapse;
}
</style>
