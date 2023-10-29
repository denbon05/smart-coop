<script setup lang="ts">
import { useAuth } from '@/composables/auth';
import type { MemberDetails } from '@/types/governor';

const { member } = defineProps<{ member: MemberDetails }>();

const auth = useAuth();
</script>

<template>
  <section id="accountDetails">
    <dl class="my-2">
      <dt class="text-orange font-weight-bold">Account address</dt>
      <dd>{{ auth.selectedAddress }}</dd>
    </dl>
    <dl class="my-2">
      <dt class="text-orange font-weight-bold">Location</dt>
      <dd>{{ auth.user.location }}</dd>
    </dl>
    <dl class="my-2">
      <dt class="text-orange font-weight-bold">Balance</dt>
      <dd>{{ member.balanceInEth }} ETH</dd>
    </dl>
    <dl class="my-2">
      <dt class="text-orange font-weight-bold">Voting power</dt>
      <dd class="d-flex align-baseline">
        {{ member.votingPower }}
        <v-chip class="mx-2">{{ `${member.votesAmount} vote` }}</v-chip>
      </dd>
    </dl>
  </section>
</template>
