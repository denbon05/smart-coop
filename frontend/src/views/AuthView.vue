<script setup lang="ts">
import { deployGovernor, joinCoopGovernor } from '@/api/governor/eth-governor';
import { addCoop, joinCoop } from '@/api/server';
import cityBg from '@/assets/images/city-buildings.svg';
import redMember from '@/assets/images/red-member.svg';
import AccountData from '@/components/auth/AccountData.vue';
import AccountPreview from '@/components/auth/AccountPreview.vue';
import { useAuth } from '@/composables/auth';
import { CoopAccount, MemberAccount } from '@/entities/Account';
import Member from '@/entities/Member';
import AppError from '@/errors/AppError';
import router from '@/router';
import { SnackbarColor, type ShowSnackbar } from '@/types/components/common';
import { AccountType } from '@/types/entities/account';
import { RouteNames } from '@/types/entities/router';
import { computed, inject, reactive, ref } from 'vue';

const props = defineProps<{ accountType: AccountType }>();
const auth = useAuth();

const isCoop = props.accountType === AccountType.COOP;

const stepIdx = ref(0);
// Indexes are relevant to the steps bellow
const shouldAccountInfoBeVisible = computed(() => stepIdx.value === 0);
const shouldDataPreviewBeVisible = computed(() => stepIdx.value === 1);

const account = reactive(isCoop ? new CoopAccount() : new MemberAccount());
const associativeImgSrc = isCoop ? cityBg : redMember;

const setAccountData = (accountData: CoopAccount | MemberAccount) => {
  Object.assign(account, accountData);
  // go to the next step
  stepIdx.value += 1;
};

// const router = useRouter();
const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const createOrJoin = async () => {
  try {
    if (isCoop) {
      // deploy new governor contract
      const address = (await deployGovernor()) as string;
      await addCoop({
        id: address,
        ...account,
      });
      showSnackbar({
        msg: 'Congrats! You created a cooperative!',
        color: SnackbarColor.OK,
      });
    } else {
      // join to existed smart coop
      await joinCoopGovernor(auth.user.coop.id);
      // write to db user joined the coop
      const memberData = {
        ...account,
        coopId: auth.user.coop.id,
        id: auth.selectedAddress!,
      };
      await joinCoop(memberData);
      auth.user = new Member({
        ...memberData,
        coop: auth.user.coop,
      });

      showSnackbar({
        msg: 'Congrats! You joined the cooperative!',
        color: SnackbarColor.OK,
      });
    }
    const defaultPage = auth.user.isGuest
      ? RouteNames.WELCOME
      : RouteNames.COOP;
    router.push({
      name: defaultPage,
    });
  } catch (err) {
    showSnackbar({
      msg: err instanceof AppError ? err.message : 'Something went wrong',
    });
    console.error(err);
  }
};
</script>

<template>
  <v-container
    ><v-row v-if="shouldAccountInfoBeVisible" justify="center"
      ><v-col cols="11" lg="8">
        <AccountData @next="setAccountData" :isCoop="isCoop"
      /></v-col>
    </v-row>

    <v-row justify="space-between" v-if="shouldDataPreviewBeVisible">
      <v-col cols="6">
        <img
          class="bg-associative"
          :src="associativeImgSrc"
          alt="Associative account image"
        />
      </v-col>
      <v-col cols="6">
        <AccountPreview
          :account="account"
          :isCoop="isCoop"
          @next="createOrJoin"
          @cancel="stepIdx = 0"
        />
      </v-col>
    </v-row>

    <section class="bg-tech"></section>
  </v-container>
</template>

<style lang="scss" scoped>
:root {
  position: relative;
  .bg-tech {
    position: absolute;
    width: 100%;
    height: 300px;
    background-image: url('@/assets/images/bg-electro.svg');
    background-size: cover;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}

.bg-associative {
  width: inherit;
  background-color: transparent;
}
</style>
