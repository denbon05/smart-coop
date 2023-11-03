<script setup lang="ts">
import { getVotingPower } from '@/api/governor/eth-governor';
import { joinCoop } from '@/api/server';
import redMemberBg from '@/assets/images/red-member.svg';
import AccountForm from '@/components/auth/AccountForm.vue';
import AccountPreview from '@/components/auth/AccountPreview.vue';
import { useAuth } from '@/composables/auth';
import { MemberAccount } from '@/entities/Account';
import Member from '@/entities/Member';
import AppError from '@/errors/AppError';
import { SnackbarColor, type ShowSnackbar } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import { computed, inject, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const auth = useAuth();
const router = useRouter();

const memberAccount = reactive(new MemberAccount());
const stepIdx = ref(0);

const setMemberData = (accountData: Omit<MemberAccount, 'coopId'>) => {
  Object.assign(memberAccount, accountData);
  // go to the next step
  stepIdx.value += 1;
};
const isLoading = ref(false);

const joinExistedCoop = async () => {
  isLoading.value = true;
  try {
    const memberData = {
      ...memberAccount,
      coopId: auth.user.coop.id,
      id: auth.selectedAddress!,
    };
    await getVotingPower(auth.user.coop.id);
    // write to db user joined the coop
    await joinCoop(memberData);
    auth.user = new Member({
      ...memberData,
      coop: auth.user.coop,
    });
    showSnackbar({
      msg: `Congrats! You joined a COOP \n"${auth.user.coop.name}"!`,
      color: SnackbarColor.OK,
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
const shouldMemberInfoBeVisible = computed(() => stepIdx.value === 0);
const shouldDataPreviewBeVisible = computed(() => stepIdx.value === 1);
</script>

<template>
  <v-container>
    <v-row justify="center" v-if="shouldMemberInfoBeVisible"
      ><v-col cols="8" class="d-flex flex-column">
        <AccountForm @save="setMemberData">
          <template #title
            >Creating member of COOP "{{ auth.user.coop.name }}"</template
          >
        </AccountForm>
      </v-col></v-row
    >

    <v-row justify="space-between" v-if="shouldDataPreviewBeVisible">
      <v-col cols="6">
        <img
          class="bg-associative"
          :src="redMemberBg"
          alt="Associative account image"
        />
      </v-col>
      <v-col cols="6">
        <AccountPreview
          :is-loading="isLoading"
          :account="memberAccount"
          @next="joinExistedCoop"
          @cancel="stepIdx = 0"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
