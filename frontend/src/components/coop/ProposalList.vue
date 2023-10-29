<script setup lang="ts">
import { fetchProposals } from '@/api/governor/eth-governor';
import { useAuth } from '@/composables/auth';
import { useProposal } from '@/composables/proposal';
import type { ShowSnackbar } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import type { FetchedProposal } from '@/types/governor';
import { computed, inject, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const proposals = ref<FetchedProposal[]>([]);

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const shouldFetchProposals = computed(
  () => route.name === RouteNames.PROPOSALS
);

watchEffect(async () => {
  if (shouldFetchProposals.value) {
    fetchProposals(auth.user.coopId)
      .then((fetchedProposals) => {
        console.log('fetchedProposals', fetchedProposals);
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
    <v-row
      ><v-col
        ><v-sheet
          color="green-darken-3"
          :elevation="2"
          border
          rounded
          class="pl-4 py-1 mx-2 d-flex justify-space-between"
        >
          <h5 class="text-subtitle-1 text-uppercase">Proposals</h5>
          <section class="d-flex w-50">
            <div class="pr-5 w-25 d-flex justify-center">YES</div>
            <div class="pr-5 w-25 d-flex justify-center">NO</div>
            <div class="pr-5 w-25 d-flex justify-center">NOT VOTED</div>
            <div class="pr-5 w-25 d-flex justify-center">TIME</div>
          </section>
        </v-sheet></v-col
      ></v-row
    >

    <v-row v-if="proposals.length"
      ><v-col>
        <section id="proposalTables" class="d-flex">
          <v-table class="flex-grow-1 mr-4">
            <tbody>
              <tr v-for="proposal in proposals" :key="proposal.id">
                <td @click="discoverProposal(proposal)" class="cursor-pointer">
                  {{ proposal.title }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-table class="w-50">
            <tbody>
              <tr v-for="proposal in proposals" :key="proposal.description">
                <td align="center">{{ proposal.forVotes }}</td>
                <td align="center">{{ proposal.againstVotes }}</td>
                <td align="center">{{ proposal.abstainVotes }}</td>
                <td align="center">{{ proposal.voteEnd }}</td>
              </tr>
            </tbody>
          </v-table>
        </section>
      </v-col></v-row
    >
    <h4 v-else class="text-center pa-5">There are no available proposals</h4>
  </template>

  <RouterView />
</template>
