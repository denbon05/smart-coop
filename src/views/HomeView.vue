<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CoopSection from '@/components/home/CoopSection.vue';

const route = useRoute();

const isCoopSectionSelected = computed(() => route.name === 'home');

const sections = [
  {
    name: 'VOTING',
    link: '/proposals',
  },
  {
    name: 'NEW PROPOSAL',
    link: '/new-proposal',
  },
  {
    name: 'VOTING HISTORY',
    link: '/proposal-history',
  },
  {
    name: 'CHAT',
    link: '#',
  },
];
</script>

<template>
  <section>
    <v-item-group mandatory v-if="isCoopSectionSelected">
      <v-container
        ><v-row justify="center"
          ><v-col cols="11" md="5">
            <CoopSection link="/proposals"> Voting </CoopSection>
          </v-col>

          <v-col cols="11" md="5">
            <CoopSection link="/new-proposal"> New Proposal </CoopSection>
          </v-col></v-row
        >
        <v-row justify="center">
          <v-col cols="11" md="5">
            <CoopSection link="/discover"> Voting history </CoopSection>
          </v-col>

          <v-col cols="11" md="5">
            <CoopSection link="/#"> Chat </CoopSection>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>

    <v-container
      ><v-row
        ><v-col>
          <v-list class="d-flex">
            <v-list-item v-for="section in sections" :key="section.name">
              <RouterLink
                :to="section.link"
                class="text-decoration-none text-black"
                :class="{ 'text-disabled': section.link === route.fullPath }"
                :aria-disabled="section.link === route.fullPath"
                ><v-list-item-title>
                  {{ section.name }}
                </v-list-item-title></RouterLink
              >
            </v-list-item>
          </v-list>
        </v-col></v-row
      >
      <RouterView />
    </v-container>
  </section>
</template>
