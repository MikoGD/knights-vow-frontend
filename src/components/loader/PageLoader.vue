<script lang="ts" setup>
import { Icon } from '@iconify/vue';
const props = defineProps<{
  show: boolean;
}>();
</script>
<template>
  <div v-if="props.show" class="page-loader">
    <Icon class="page-loader__loader" icon="svg-spinners:ring-resize" />
  </div>
</template>
<style lang="scss" scoped>
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &__loader {
    width: 10rem;
    height: 10rem;
  }
}
</style>
