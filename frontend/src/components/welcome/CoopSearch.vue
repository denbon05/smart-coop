<script setup lang="ts">
import { searchCoop } from '@/api/server/';
import { useAuth } from '@/composables/auth';
import type { Coop } from '@/types/backend-api';
import type { ShowSnackbar } from '@/types/components/common';
import { RouteNames } from '@/types/entities/router';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const showSnackbar = inject<ShowSnackbar>('showSnack', () => null);

const minChars = 3;

const isLoading = ref(false);
const coopList = ref<Coop[]>([]);

// TODO debounce
const search = async (value: string) => {
  if (value.length < minChars) {
    return;
  }

  isLoading.value = true;
  try {
    const matchedCoops = await searchCoop(value);
    coopList.value = matchedCoops;
  } catch (err) {
    console.error(err);
    showSnackbar({ msg: "Can't proceed search" });
  }
  isLoading.value = false;
};

const text = ref('');
const router = useRouter();
const auth = useAuth();

const selectCoop = (coop: Coop | string) => {
  if (coop instanceof Object) {
    auth.user.coop = coop;
    router.push({
      name: RouteNames.JOIN_COOP,
    });
  }
};
</script>

<template>
  <v-row justify="end"
    ><v-col cols="11" md="7"
      ><div class="d-flex flex-column">
        <section class="mb-5 text-orange font-weight-bold" id="coopSearch">
          Before you join, check if your coop was created
        </section>
        <v-combobox
          label="Name of coop, country, city"
          density="comfortable"
          append-inner-icon="mdi-magnify"
          class="mb-3"
          menu-icon=""
          item-props
          v-model="text"
          type="search"
          item-title="name"
          item-value="id"
          validate-on="blur"
          persistent-hint
          :rules="[
            (v: string) =>
              (!!v && v.length >= minChars) ||
              `Type at least ${minChars} characters`,
          ]"
          :loading="isLoading"
          @update:search="search"
          @update:model-value="selectCoop"
          no-filter
          return-object
          variant="solo"
          :items="coopList"
        ></v-combobox>
      </div>
    </v-col>
  </v-row>
</template>
