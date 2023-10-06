<script setup lang="ts">
import {
  AccountType as AccountEnum,
  type AccountData as MemberDataType,
} from '@/types/entities/account';
import { Account } from '@/utils/auth';
import { computed, ref } from 'vue';
import AccountData from './AccountData.vue';
import AccountPreview from './AccountPreview.vue';
import AccountType from './AccountType.vue';

// instantiate the account to fullfil
const account = new Account();

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

const signUp = () => {
  // TODO
  console.log('VALIDATE', account.parse());
  alert(JSON.stringify(account, null, 2));
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
    <AccountData v-if="shouldMemberInfoBeVisible" @next="setAccountData" />
    <AccountPreview
      v-if="shouldDataPreviewBeVisible"
      @next="signUp"
      @cancel="stepIdx = 0"
      :account="account"
    />
  </v-sheet>
</template>
