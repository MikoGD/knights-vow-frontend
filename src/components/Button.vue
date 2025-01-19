<script lang="ts" setup>
import { Icon } from '@iconify/vue';
const props = withDefaults(
  defineProps<{
    isLoading?: boolean;
    disabled?: boolean;
    type?: 'submit' | 'button';
  }>(),
  {
    isLoading: false,
    type: 'submit',
  },
);
</script>
<template>
  <button class="button" type="submit" :disabled="props.disabled || props.isLoading">
    <Icon
      v-if="props.isLoading"
      class="button__loader"
      icon="svg-spinners:3-dots-bounce"
      :type="props.type"
    />
    <slot v-else />
  </button>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/colors';

.button {
  width: 8rem;
  height: 3rem;
  font-size: 1rem;
  color: colors.$text-primary;
  background-color: #bfbfbf;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.3125rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  &__loader {
    font-size: 2rem;
  }
}
</style>
