<script setup lang="ts">
import { makeProposal } from '@/api/governor/eth-governor';
import { fetchAccounts } from '@/api/server/member';
import { useAuth } from '@/composables/auth';
import type { Member } from '@/types/backend-api';
import { SnackbarColor, type ShowSnackbar } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import type { IProposal } from '@/types/governor';
import { useField, useForm } from 'vee-validate';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const { handleSubmit } = useForm<IProposal>({
  validationSchema: {
    title(value: string) {
      if (value?.length >= 3) return true;

      return 'Title needs to be at least 3 characters.';
    },
    description(value: string) {
      if (value?.length > 5) return true;

      return 'Description needs to be at least 5 characters.';
    },
    cost(value: number) {
      if (value > 0) return true;

      return 'Insufficient amount.';
    },
    receiverAddress(value: string) {
      // 42 is a length of valid hexadecimal address
      return value?.length === 42 || 'Required a valid Ethereum address';
    },
  },
});

const title = useField<string>('title');
const description = useField<string>('description');
const cost = useField<number>('cost');
const receiverAddress = useField<Member>('receiverAddress');

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);
const auth = useAuth();
const router = useRouter();
const isLoading = ref(false);

const submit = handleSubmit(async (proposal) => {
  isLoading.value = true;
  try {
    await makeProposal(auth.user.coopId, proposal);
    showSnackbar({ msg: 'Proposal created', color: SnackbarColor.OK });
    await router.push({
      name: RouteNames.PROPOSALS,
    });
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: 'Failed to make a proposal' });
  }
  isLoading.value = true;
});

const accounts = ref<Member[]>();

fetchAccounts({ coopId: auth.user.coopId }).then((fetchedAccounts) => {
  accounts.value = fetchedAccounts;
});
</script>

<template>
  <v-row
    ><v-col cols="7">
      <form @submit.prevent="submit">
        <div class="d-flex">
          <v-text-field
            v-model="title.value.value"
            :error-messages="title.errorMessage.value"
            label="Title of proposal"
            variant="outlined"
            density="comfortable"
            class="mb-3 w-33"
          ></v-text-field>
          <div class="pa-2"></div>
          <v-text-field
            v-model="cost.value.value"
            :error-messages="cost.errorMessage.value"
            label="Cost of proposal in ETH"
            variant="outlined"
            density="comfortable"
            class="mb-3 w-25"
            :initial-value="0"
          ></v-text-field>
        </div>

        <v-textarea
          name="description"
          variant="outlined"
          label="Describe your proposal"
          :error-messages="description.errorMessage.value"
          v-model="description.value.value"
          density="comfortable"
          class="mb-3"
          no-resize
        ></v-textarea>

        <v-text-field
          label="Executor address"
          v-model="receiverAddress.value.value"
          :error-messages="receiverAddress.errorMessage.value"
          :items="accounts"
          density="comfortable"
          item-title="name"
          item-value="id"
          variant="outlined"
        ></v-text-field>
      </form>
    </v-col>

    <v-col cols="4">
      <section class="h-100 d-flex align-end justify-center">
        <v-btn
          size="large"
          rounded="lg"
          :disabled="isLoading"
          @click="submit"
          class="btn-sunset text-white btn-big"
        >
          create proposal
        </v-btn>
      </section>
    </v-col>
  </v-row>
</template>
