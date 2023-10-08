<script setup lang="ts"></script>

<template>
  <section class="d-flex flex-column">
    <RouterLink to="/coop/new-proposal" class="align-self-end">
      <v-btn color="primary"> New proposal </v-btn>
    </RouterLink>
    <v-list lines="one" class="mt-3">
      <v-list-item
        v-for="n in 3"
        :key="n"
        :title="'Item ' + n"
        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
      ></v-list-item>
    </v-list>
  </section>
</template>
