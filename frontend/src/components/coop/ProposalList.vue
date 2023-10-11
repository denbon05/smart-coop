<script setup lang="ts">
const desserts = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
  },
  {
    name: 'Eclair',
    calories: 262,
  },
  {
    name: 'Cupcake',
    calories: 305,
  },
  {
    name: 'Gingerbread',
    calories: 356,
  },
  {
    name: 'Jelly bean',
    calories: 375,
  },
  {
    name: 'Lollipop',
    calories: 392,
  },
  {
    name: 'Honeycomb',
    calories: 408,
  },
  {
    name: 'Donut',
    calories: 452,
  },
  {
    name: 'KitKat',
    calories: 518,
  },
];

// TODO fetch proposals
</script>

<template>
  <v-row
    ><v-col
      ><v-sheet
        color="green-darken-3"
        :elevation="2"
        border
        rounded
        class="pl-4 py-1 mx-2 d-flex justify-space-between"
      >
        <h5 class="text-subtitle-1 text-uppercase">Proposals</h5>
        <section class="d-flex w-50">
          <div class="w-25 d-flex justify-center">YES</div>
          <div class="w-25 d-flex justify-center">NO</div>
          <div class="w-25 d-flex justify-center">NO VOTED</div>
          <div class="w-25 d-flex justify-center">TIME</div>
        </section>
      </v-sheet></v-col
    ></v-row
  >
  <v-row
    ><v-col>
      <section id="proposalTables" class="d-flex">
        <v-table class="flex-grow-1 mr-4">
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.name }}</td>
            </tr>
          </tbody>
        </v-table>

        <v-table class="w-50">
          <tbody>
            <tr v-for="item in desserts" :key="item.calories">
              <td align="center">{{ item.calories }}</td>
              <td align="center">{{ item.calories }}</td>
              <td align="center">{{ item.calories }}</td>
              <td align="center">{{ item.calories }}</td>
            </tr>
          </tbody>
        </v-table>
      </section>
    </v-col></v-row
  >
</template>

<style lang="scss">
// .
</style>
