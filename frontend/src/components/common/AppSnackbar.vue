<script setup lang="ts">
import { reactive } from 'vue';
import type {
  SnackbarParm,
  ShowSnackbar,
  ISnackbar,
} from '@/types/components/common';
import { SnackbarColor } from '@/types/components/common';

const snackbar: ISnackbar = reactive({
  isVisible: false,
  msg: '',
  color: SnackbarColor.OK,
});

const showSnackbar: ShowSnackbar = ({ msg, color }: SnackbarParm) => {
  snackbar.color = color ?? SnackbarColor.ERR;
  snackbar.msg = msg;
  snackbar.isVisible = true;
};

defineExpose({
  showSnackbar,
});
</script>

<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar.isVisible"
      multi-line
      :color="snackbar.color"
      position="sticky"
    >
      {{ snackbar.msg }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.isVisible = false"> X </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
