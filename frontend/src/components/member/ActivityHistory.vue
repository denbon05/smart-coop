<script setup lang="ts">
import {
  fetchMemberPaymentHistory,
  fetchMemberVotingHistory,
} from '@/api/governor/eth-governor';
import { useAuth } from '@/composables/auth';
import type { ShowSnackbar } from '@/types/components/common';
import type {
  MemberPaymentHistory,
  MemberVotingHistory,
} from '@/types/governor';
import { inject, onMounted, ref } from 'vue';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const auth = useAuth();
const paymentHistory = ref<MemberPaymentHistory[]>([]);
const votingHistory = ref<MemberVotingHistory>([]);

onMounted(async () => {
  try {
    const fetchedVotingHistory = await fetchMemberVotingHistory(
      auth.user.coopId
    );
    votingHistory.value = fetchedVotingHistory;
    const fetchedPaymentHistory = await fetchMemberPaymentHistory(
      auth.user.coopId
    );
    paymentHistory.value = fetchedPaymentHistory;
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to load the history of activity' });
  }
});
</script>

<template id="memberPaymentHistory">
  <div class="text-start text-orange font-weight-bold pt-5">Voting history</div>
  <section>
    <v-table density="compact" height="200" fixed-header>
      <thead>
        <tr>
          <th class="text-left">Proposal ID</th>
          <th class="text-left">Decision</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vote, idx) in votingHistory" :key="`vote-${idx}`">
          <td>{{ vote.proposalId }}</td>
          <td>{{ vote.decision }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>

  <div class="my-4"></div>

  <section id="memberVoteHistory">
    <div class="text-start text-orange font-weight-bold">Payment history</div>
    <v-table density="compact" height="250" fixed-header>
      <thead>
        <tr>
          <th class="text-left">Payed</th>
          <th class="text-left">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(payment, idx) in paymentHistory" :key="`payment-${idx}`">
          <td>{{ payment.amountInEth }} ETH</td>
          <td>{{ payment.localTime }}</td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>
