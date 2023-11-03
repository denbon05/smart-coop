<script setup lang="ts">
import { payBill } from '@/api/governor/eth-governor';
import { connectToWallet } from '@/api/governor/eth-wallet';
import { useAuth } from '@/composables/auth';
import AppError from '@/errors/AppError';
import { SnackbarColor, type ShowSnackbar } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import { computed, inject, ref } from 'vue';
import { RouterLink } from 'vue-router';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const props = defineProps<{
  isAccountFetching: boolean;
}>();

const auth = useAuth();

const connectWallet = async () => {
  try {
    await connectToWallet();
    // update auth state
    useAuth();
  } catch (err) {
    const msg =
      err instanceof AppError ? err.message : 'Something went terribly wrong';
    showSnackbar({ msg });
    console.error(err);
  }
};

const isBillTxOn = ref(false);

const amountInEth = '0.2';

const payDueAmount = async () => {
  isBillTxOn.value = true;
  try {
    await payBill(auth.user.coopId, amountInEth);
    showSnackbar({ msg: 'Bill payed', color: SnackbarColor.OK });
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to pay the bill' });
  }
  isBillTxOn.value = false;
};

const defaultPage = computed(() =>
  auth.user.isGuest ? RouteNames.WELCOME : RouteNames.COOP
);
</script>

<template>
  <v-app-bar
    :elevation="2"
    color="teal-darken-4"
    image="https://picsum.photos/1920/1080?random"
    class="px-3 px-md-7 px-lg-10"
  >
    <template v-slot:image>
      <v-img
        gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
      ></v-img>
    </template>

    <template v-slot:prepend>
      <RouterLink
        :to="{
          name: defaultPage,
        }"
      >
        <v-app-bar-nav-icon>
          <img
            src="@/assets/images/top-smart-tree.png"
            width="50"
            height="45"
          />
        </v-app-bar-nav-icon>
      </RouterLink>
    </template>

    <v-app-bar-title
      ><RouterLink
        :to="{
          name: defaultPage,
        }"
        class="text-decoration-none text-white"
        id="logoTitle"
      >
        Smart Coop</RouterLink
      ></v-app-bar-title
    >

    <v-spacer></v-spacer>

    <template v-if="!props.isAccountFetching">
      <!-- show buttons after account fetched if there is one -->
      <template v-if="!auth.user.isGuest">
        <section class="d-flex align-center">
          <v-btn
            @click="payDueAmount"
            class="mx-3 d-flex align-center"
            variant="outlined"
            rounded="lg"
            :disabled="isBillTxOn"
            >Pay
            <v-chip class="ml-2 px-2" variant="text" size="small"
              >{{ amountInEth }} ETH</v-chip
            ></v-btn
          >
          <RouterLink
            :to="{
              name: RouteNames.ACCOUNT,
            }"
            class="text-decoration-none text-grey-darken-4"
          >
            <section id="accountBarInfo" class="d-flex flex-column text-end">
              <strong>{{ auth.user.name }}</strong>
              <small>{{ auth.user.location }}</small>
            </section>
          </RouterLink>
        </section>
      </template>
      <v-btn
        :disabled="!!auth.selectedAddress"
        v-else
        variant="outlined"
        rounded="lg"
        @click="connectWallet"
      >
        Connect
      </v-btn>
    </template>
  </v-app-bar>
</template>

<style lang="scss" scoped>
#logoTitle {
  font-family: 'Jeju Hallasan';
  font-weight: 400;
}
</style>
