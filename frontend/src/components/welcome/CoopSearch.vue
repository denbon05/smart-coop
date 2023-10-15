<script setup lang="ts">
import { createCoop } from '@/api/server/';

const registerNewCoop = async () => {
  const res = await createCoop({
    id: 'kljfdkjfkds',
    location: 'kfjsdkf',
    name: 'klfsdkfsdkfj',
  });

  console.log('TEST res', res);
};
</script>

<template>
  <div class="d-flex flex-column">
    <section id="coopSearch">Coop Search</section>
    <v-btn @click="registerNewCoop">TEST</v-btn>
  </div>
</template>
@/api/serrver
