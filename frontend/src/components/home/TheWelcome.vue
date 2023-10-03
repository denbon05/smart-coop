<script setup lang="ts">
interface IAdvantage {
  title: string;
  icon: string;
}
// TODO news if logged
const advantages: IAdvantage[] = [
  // {title: ''}
];
</script>

<template>
  <v-container fluid>
    <v-row dense justify="center">
      <v-col cols="12" md="10" lg="9">
        <v-card>
          <v-card-title>
            Have direct influence on your local coop
          </v-card-title>
          <v-card-subtitle> Participate in community: </v-card-subtitle>
          <v-card-text>
            <v-list lines="one">
              <v-list-item
                v-for="n in 3"
                :key="n"
                :title="'Item ' + n"
                subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
              ></v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
