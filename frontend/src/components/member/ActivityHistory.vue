<script setup lang="ts">
import {
  fetchMemberPaymentHistory,
  fetchMemberVotingHistory,
} from '@/api/governor/eth-governor';
import { useAuth } from '@/composables/auth';
import type { ShowSnackbar } from '@/types/components/common';
import { inject, onMounted } from 'vue';

const desserts = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
  },
  {
    name: 'Eclair',
    calories: 262,
  },
  {
    name: 'Cupcake',
    calories: 305,
  },
];

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const auth = useAuth();

onMounted(async () => {
  try {
    await fetchMemberVotingHistory(auth.user.coopId);
    await fetchMemberPaymentHistory(auth.user.coopId);
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to load the history of activity' });
  }
});
</script>

<template id="memberPaymentHistory">
  <section>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">ProposalID</th>
          <th class="text-left">Decision</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>

  <div class="my-3"></div>

  <section id="memberVoteHistory">
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Calories</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>
