<script setup lang="ts">
import { deployGovernor } from '@/api/governor/eth-governor';
import { addCoop, joinCoop } from '@/api/server';
import AccountForm from '@/components/auth/AccountForm.vue';
import AccountPreview from '@/components/auth/AccountPreview.vue';
import { useAuth } from '@/composables/auth';
import { CoopAccount, MemberAccount } from '@/entities/Account';
import Member from '@/entities/Member';
import AppError from '@/errors/AppError';
import { type ShowSnackbar, SnackbarColor } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import { computed, inject, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import cityBg from '@/assets/images/city-buildings.svg';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const auth = useAuth();
const router = useRouter();

const coopAccount = reactive(new CoopAccount());
const memberAccount = reactive(new MemberAccount());
const stepIdx = ref(0);

const setCoopData = (accountData: CoopAccount) => {
  Object.assign(coopAccount, accountData);
  // go to the next step
  stepIdx.value += 1;
};

const setMemberData = (accountData: Omit<MemberAccount, 'coopId'>) => {
  Object.assign(memberAccount, accountData);
  // go to the next step
  stepIdx.value += 1;
};

const isLoading = ref(false);

const createAndJoinCoop = async () => {
  isLoading.value = true;
  try {
    // deploy new governor contract
    const address = (await deployGovernor()) as string;
    await addCoop({
      id: address,
      ...coopAccount,
    });
    showSnackbar({
      msg: 'Congrats! You a member of a new cooperative!',
      color: SnackbarColor.OK,
    });
    const memberData = {
      ...memberAccount,
      coopId: address,
      id: auth.selectedAddress!,
    };
    // write to db user joined the coop
    await joinCoop(memberData);
    auth.user = new Member({
      ...memberData,
      coop: auth.user.coop,
    });

    await router.push({
      name: RouteNames.HOME,
    });
  } catch (err) {
    console.error(err);
    showSnackbar({
      msg: err instanceof AppError ? err.message : 'Something went wrong',
    });
  }
  isLoading.value = false;
};

// Indexes are relevant to the steps bellow
const shouldCoopInfoBeVisible = computed(() => stepIdx.value === 0);
const shouldMemberInfoBeVisible = computed(() => stepIdx.value === 1);
const shouldDataPreviewBeVisible = computed(() => stepIdx.value === 2);
</script>

<template>
  <v-container>
    <v-row
      justify="center"
      v-if="shouldCoopInfoBeVisible || shouldMemberInfoBeVisible"
      ><v-col cols="8" class="d-flex flex-column">
        <AccountForm v-if="shouldCoopInfoBeVisible" @save="setCoopData" is-coop>
          <template #action-text>next step</template>
        </AccountForm>

        <AccountForm v-if="shouldMemberInfoBeVisible" @save="setMemberData">
          <template #title>Join "{{ coopAccount.name }}" COOP</template>
        </AccountForm>
      </v-col></v-row
    >

    <v-row justify="space-between" v-if="shouldDataPreviewBeVisible">
      <v-col cols="6">
        <img
          class="bg-associative"
          :src="cityBg"
          alt="Associative account image"
        />
      </v-col>
      <v-col cols="6">
        <AccountPreview
          :account="coopAccount"
          :is-loading="isLoading"
          is-coop
          @next="createAndJoinCoop"
          @cancel="stepIdx = 0"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
