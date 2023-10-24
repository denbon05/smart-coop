<script setup lang="ts">
import CoopSection from '@/components/home/CoopSection.vue';
import { RouteNames } from '@/types/entities/router';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const sections = [
  {
    sectionName: 'VOTING',
    linkName: RouteNames.PROPOSALS,
  },
  {
    sectionName: 'NEW PROPOSAL',
    linkName: RouteNames.NEW_PROPOSAL,
  },
  {
    sectionName: 'VOTING HISTORY',
    linkName: RouteNames.PROPOSAL_HISTORY,
  },
  {
    sectionName: 'CHAT',
    linkName: RouteNames.PROPOSAL_HISTORY,
  },
];

const route = useRoute();

const isCoopPage = computed(() => route.name === RouteNames.COOP);
const isPartOfCoopSection = computed(() =>
  Boolean(
    route.matched.find(({ name }) =>
      sections.find(({ linkName }) => name === linkName)
    )
  )
);

console.log({
  isCoopPage: isCoopPage.value,
  isPartOfCoopSection: isPartOfCoopSection.value,
  // isPartOfCoopSectionEFF: isPartOfCoopSection.effect,
});
</script>

<template>
  <section>
    <v-item-group mandatory v-if="isCoopPage">
      <v-container
        ><v-row justify="center"
          ><v-col cols="11" md="5">
            <CoopSection :link-name="RouteNames.PROPOSALS">
              Voting
            </CoopSection>
          </v-col>

          <v-col cols="11" md="5">
            <CoopSection :link-name="RouteNames.NEW_PROPOSAL">
              New Proposal
            </CoopSection>
          </v-col></v-row
        >
        <v-row justify="center">
          <v-col cols="11" md="5">
            <CoopSection :link-name="RouteNames.PROPOSAL_HISTORY">
              Voting history
            </CoopSection>
          </v-col>

          <v-col cols="11" md="5">
            <CoopSection disabled :link-name="RouteNames.COOP_DISCOVER">
              Discover
            </CoopSection>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>

    <v-container
      ><v-row v-if="isPartOfCoopSection"
        ><v-col>
          <v-list class="d-flex">
            <v-list-item
              v-for="{ sectionName, linkName } in sections"
              :key="sectionName"
            >
              <RouterLink
                :to="{
                  name: linkName,
                }"
                class="text-decoration-none text-black"
                :class="{ 'text-disabled': linkName === route.name }"
                :aria-disabled="linkName === route.name"
                ><v-list-item-title>
                  {{ sectionName }}
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
