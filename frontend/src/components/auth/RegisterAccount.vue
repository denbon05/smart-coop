<script setup lang="ts">
import {
  deployGovernor,
  isAccountConnectedToCoop,
  joinToCoop,
} from '@/api/eth-governor';
import { useAuth } from '@/composables/auth';
import AppError from '@/errors/AppError';
import type { ShowSnackbar } from '@/types/components/common';
import {
  AccountType as AccountEnum,
  type AccountData as MemberDataType,
} from '@/types/entities/account';
import { Account } from '@/utils/auth';
import { computed, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import AccountData from './AccountData.vue';
import AccountPreview from './AccountPreview.vue';
import AccountType from './AccountType.vue';

// instantiate the account to fullfil
const account = new Account();
const auth = useAuth();

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const stepIdx = ref(0);
// Indexes are relevant to the steps bellow
const shouldAccountTypeBeVisible = computed(() => stepIdx.value === 0);
const shouldMemberInfoBeVisible = computed(() => stepIdx.value === 1);
const shouldDataPreviewBeVisible = computed(() => stepIdx.value === 2);

const steps = computed(() => {
  const links = [
    {
      title: 'Chose type of account',
      disabled: !shouldAccountTypeBeVisible.value,
      href: '#account-type',
    },
    {
      title: 'Provide needed information',
      disabled: !shouldMemberInfoBeVisible.value,
      href: '#account-info',
    },
    {
      title: 'Preview',
      disabled: !shouldDataPreviewBeVisible.value,
      href: '#submit-preview',
    },
  ];

  return links;
});

const setAccountType = (accountType: AccountEnum) => {
  account.setAccountType(accountType);
  // go to the next step
  stepIdx.value += 1;
};

const setAccountData = (memberData: MemberDataType) => {
  account.setAccountData(memberData);
  // go to the next step
  stepIdx.value += 1;
};

const router = useRouter();

const createOrJoin = async () => {
  try {
    const accountData = account.parse();
    if (account.accountType === AccountEnum.COOP) {
      // deploy new governor contract
      await deployGovernor();
    } else {
      // join to existed smart coop
      await joinToCoop(accountData);
    }
    const exists = await isAccountConnectedToCoop();
    console.log('Register account', { exists });
    auth.setAccount({ isMember: exists });
    router.push({
      name: 'home',
    });
  } catch (err) {
    showSnackbar({
      msg: err instanceof AppError ? err.message : 'Unable to sign up',
    });
    console.error(err);
  }
};
</script>

<template>
  <v-sheet elevation="2" rounded class="pa-4">
    <v-breadcrumbs
      :items="steps"
      v-model="stepIdx"
      density="comfortable"
      class="d-flex justify-lg-space-around"
    >
      <template v-slot:divider>
        <v-icon icon="mdi-forward"></v-icon>
      </template>
    </v-breadcrumbs>

    <AccountType v-if="shouldAccountTypeBeVisible" @next="setAccountType" />
    <AccountData
      v-if="shouldMemberInfoBeVisible"
      :accountType="account.accountType!"
      @next="setAccountData"
    />
    <AccountPreview
      v-if="shouldDataPreviewBeVisible"
      @next="createOrJoin"
      @cancel="stepIdx = 0"
      :account="account"
    />
  </v-sheet>
</template>
