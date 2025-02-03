<script lang="ts" setup>
import { Icon } from '@iconify/vue';
const props = defineProps<{ isLoading: boolean }>();
</script>
<template>
  <div class="component-loader">
    <Icon
      v-if="props.isLoading"
      class="component-loader__loader"
      icon="svg-spinners:3-dots-bounce"
    />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/utils';
.component-loader {
  @include utils.column;
  position: relative;
  align-items: center;
  justify-content: start;

  &__loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 7rem;
  }
}
</style>
