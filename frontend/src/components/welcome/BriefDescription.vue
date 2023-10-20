<script setup lang="ts">
const benefits = [
  'participate in the decision-making process',
  'access important information',
  'collaborate with neighbors to enhance the quality of community living transparency',
  'manage maintenance requests',
  'vote on proposals',
  'have transparency where your money go',
];
</script>

<template>
  <v-row justify="start"
    ><v-col cols="10" md="7" class="pt-0">
      <v-card class="px-5 py-3" elevation="4">
        <v-card-item>
          <h2 class="text-green text-center text-h5 py-2">
            It is a platform that allows you to take an active role in your
            housing association and manage your housing-related affairs
            efficiently.
          </h2>
          <v-card-text>
            <ul>
              <li v-for="benefit of benefits" :key="benefit" class="py-1">
                {{ benefit }}
              </li>
            </ul>
          </v-card-text>
        </v-card-item>
      </v-card>
    </v-col></v-row
  >
</template>
