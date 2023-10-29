<script setup lang="ts">
import { fetchGovernorDetails } from '@/api/governor/eth-governor';
import { fetchCoop } from '@/api/server';
import { useAuth } from '@/composables/auth';
import { CoopAccount } from '@/entities/Account';
import type { ShowSnackbar } from '@/types/components/common';
import type { GovernorDetails } from '@/types/governor';
import type { FetchedCoop } from '@/types/server/cooperatives';
import { inject, onMounted, reactive, ref } from 'vue';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

// default values
const coop = reactive<FetchedCoop>({
  ...new CoopAccount(),
  id: '',
  members: [],
});
const coopDetails = reactive<GovernorDetails>({
  balanceInEth: '',
});

const auth = useAuth();

const isCoopLoading = ref(false);

onMounted(async () => {
  isCoopLoading.value = true;
  try {
    const details = await fetchGovernorDetails(auth.user.coopId);
    Object.assign(coopDetails, details);
    const fetchedCoop = await fetchCoop(auth.user.coopId);
    Object.assign(coop, fetchedCoop);
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to load a coop' });
  }
  isCoopLoading.value = false;
});
</script>

<template>
  <v-row
    ><v-col>
      <h4 class="text-h4 my-4">{{ coop.name }}</h4>
    </v-col></v-row
  >
  <v-row justify="center"
    ><v-col md="7" class="d-flex flex-column">
      <dl class="my-2">
        <dt class="text-orange font-weight-bold">Contract address</dt>
        <dd>{{ coop.id }}</dd>
      </dl>
      <dl class="my-2">
        <dt class="text-orange font-weight-bold">Location</dt>
        <dd>{{ coop.location }}</dd>
      </dl>
      <dl class="my-2">
        <dt class="text-orange font-weight-bold">Balance</dt>
        <dd>{{ coopDetails.balanceInEth }} ETH</dd>
      </dl>
    </v-col>

    <v-col md="5" class="d-flex flex-column justify-start">
      <h5 class="text-orange text-h5 font-weight-bold">Members:</h5>
      <v-list lines="one">
        <v-list-item
          v-for="member in coop.members"
          :key="member.id"
          :title="member.name"
          :subtitle="member.id"
        ></v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
