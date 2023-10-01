<script setup lang="ts">
import AboutMember from './AboutMember.vue';
import ActivityHistory from './ActivityHistory.vue';
</script>

<template>
  <v-row justify="center" align="start"
    ><v-col lg="3" cols="10"> <AboutMember /> </v-col
    ><v-col lg="7" cols="10"> <ActivityHistory /> </v-col
  ></v-row>
</template>
