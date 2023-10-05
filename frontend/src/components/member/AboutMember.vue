<script setup lang="ts">
import { useUser } from '@/composables/user';

const user = useUser();
</script>

<template>
  <v-row justify="center"
    ><v-col cols="8">
      <v-card class="mx-auto" variant="tonal">
        <v-card-item>
          <div>
            <div class="text-overline mb-1">tonal</div>
            <div class="text-h6 mb-1">Headline</div>
            <div class="text-caption">
              {{ user.selectedAddress }}
            </div>
          </div>
        </v-card-item>

        <v-card-actions>
          <v-btn> Button </v-btn>
        </v-card-actions>
      </v-card>
    </v-col></v-row
  >
</template>
@/composables/auth
