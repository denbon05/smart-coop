<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CoopSection from '@/components/coop/CoopSection.vue';

const route = useRoute();

const isCoopSectionSelected = computed(() => route.name === 'coop');
</script>

<template>
  <section>
    <v-item-group mandatory v-if="isCoopSectionSelected">
      <v-container
        ><v-row justify="center"
          ><v-col cols="11" md="5">
            <CoopSection link="/coop/proposals"> Proposals </CoopSection>
          </v-col>

          <v-col cols="11" md="5">
            <CoopSection link="/coop/new-proposal"> New Proposal </CoopSection>
          </v-col></v-row
        >
        <v-row justify="center">
          <v-col cols="11" md="5">
            <CoopSection link="/coop/proposals"> TODO </CoopSection>
          </v-col>

          <v-col cols="11" md="5">
            <CoopSection link="/coop/new-proposal"> TODO </CoopSection>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>

    <RouterView />
  </section>
</template>
