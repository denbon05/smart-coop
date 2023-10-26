<script setup lang="ts">
import { fetchProposals } from '@/api/governor/eth-governor';
import { useAuth } from '@/composables/auth';
import type { ShowSnackbar } from '@/types/components/common';
import type { FetchedProposal } from '@/types/governor';
import { inject, ref } from 'vue';

const proposals = ref<FetchedProposal[]>([]);

const auth = useAuth();
const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

fetchProposals(auth.user.coopId)
  .then((fetchedProposals) => {
    console.log(
      'PropsalList res',
      fetchedProposals,
      '\n------------------------\n'
    );
    proposals.value = fetchedProposals;
  })
  .catch((err) => {
    console.error(err);
    showSnackbar({ msg: 'Failed to fetch the proposals' });
  });
</script>

<template>
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
          <div class="w-25 d-flex justify-center">YES</div>
          <div class="w-25 d-flex justify-center">NO</div>
          <div class="w-25 d-flex justify-center">NO VOTED</div>
          <div class="w-25 d-flex justify-center">TIME</div>
        </section>
      </v-sheet></v-col
    ></v-row
  >
  <v-row
    ><v-col>
      <section id="proposalTables" class="d-flex">
        <v-table class="flex-grow-1 mr-4">
          <tbody>
            <tr v-for="proposal in proposals" :key="proposal.id">
              <td>{{ proposal.title }}</td>
            </tr>
          </tbody>
        </v-table>

        <v-table class="w-50">
          <tbody>
            <tr v-for="proposal in proposals" :key="proposal.description">
              <td align="center">{{ proposal.votedFor }}</td>
              <td align="center">{{ proposal.votedAgainst }}</td>
              <td align="center">{{ proposal.abstain }}</td>
              <td align="center">{{ proposal.voteEnd }}</td>
            </tr>
          </tbody>
        </v-table>
      </section>
    </v-col></v-row
  >
</template>

<style lang="scss">
// .
</style>
