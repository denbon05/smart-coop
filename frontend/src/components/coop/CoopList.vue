<script setup lang="ts"></script>

<template>
  <v-row justify="center"
    ><v-col cols="10">
      <v-list lines="one">
        <v-list-item
          v-for="n in 3"
          :key="n"
          :title="'Item ' + n"
          subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
        ></v-list-item>
      </v-list> </v-col
  ></v-row>
</template>
