<script setup lang="ts">
import { ref } from 'vue';
import AccountType from './AccountType.vue';
import MemberInfo from './MemberInfo.vue';
import { computed } from 'vue';
import { shallowRef } from 'vue';

const components = [AccountType, MemberInfo];

const stepNum = ref(1);

const steps = computed(() => {
  const links = [
    {
      title: 'Chose type of account',
      disabled: false, // always on
      href: '#account-type',
    },
    {
      title: 'Provide needed information',
      disabled: stepNum.value < 2,
      href: '#account-info',
    },
    {
      title: 'Preview',
      disabled: stepNum.value < 3,
      href: '#submit-preview',
    },
  ];
  console.log('auth stepNum', stepNum.value);

  return links;
});

const component = shallowRef(AccountType);

const goNextStep = (event: PointerEvent) => {
  console.log('goNext', event);
};
</script>

<template>
  <v-sheet elevation="2" rounded class="pa-4">
    <v-breadcrumbs
      :items="steps"
      density="comfortable"
      class="d-flex justify-lg-space-around"
      @click="goNextStep"
    >
      <!-- <template v-slot:title="{ item, index }">
        <span>{{ `${index + 1} ${item.title}` }}</span>
      </template> -->
      <template v-slot:divider>
        <v-icon icon="mdi-forward"></v-icon>
      </template>
    </v-breadcrumbs>

    <component :is="component" />
  </v-sheet>
</template>
