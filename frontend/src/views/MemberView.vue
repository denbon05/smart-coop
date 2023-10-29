<script setup lang="ts">
import AboutMember from '@/components/member/AboutMember.vue';
import ActivityHistory from '@/components/member/ActivityHistory.vue';

import { fetchMemberDetails } from '@/api/governor/eth-governor';
import { useAuth } from '@/composables/auth';
import type { ShowSnackbar } from '@/types/components/common';
import type { MemberDetails } from '@/types/governor';
import { inject, onMounted, reactive, ref } from 'vue';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const auth = useAuth();
const isMemberDetailsLoading = ref(false);
const member = reactive<MemberDetails>({
  balanceInEth: '',
  votesAmount: 0,
  votingPower: '',
});

onMounted(async () => {
  isMemberDetailsLoading.value = true;
  try {
    const fetchedMemberDetails = await fetchMemberDetails(auth.user.coopId);
    Object.assign(member, fetchedMemberDetails);
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to load member details' });
  }
  isMemberDetailsLoading.value = false;
});
</script>

<template>
  <v-row justify="center" align="start"
    ><v-col cols="10">
      <h4 class="text-h4 my-4">{{ auth.user.name }}</h4>
    </v-col></v-row
  >

  <v-row justify="center" align="start"
    ><v-col md="4">
      <AboutMember :member="member" />
    </v-col>
    <v-col md="6"><ActivityHistory /> </v-col>
  </v-row>
</template>
