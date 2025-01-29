<script lang="ts" setup>
import { Icon } from '@iconify/vue';
const props = withDefaults(
  defineProps<{
    isLoading?: boolean;
    disabled?: boolean;
    type?: 'submit' | 'button' | 'icon';
    icon?: string;
    class?: string;
  }>(),
  {
    isLoading: false,
    type: 'submit',
  },
);

const emits = defineEmits<{
  click: [MouseEvent];
}>();
</script>
<template>
  <button
    v-if="props.type !== 'icon'"
    class="button"
    :class="props.class"
    :type="props.type"
    :disabled="props.disabled || props.isLoading"
    @click="emits('click', $event)"
  >
    <Icon v-if="props.isLoading" class="button__loader" icon="svg-spinners:3-dots-bounce" />
    <slot v-else />
  </button>
  <button
    v-if="props.type === 'icon' && props.icon"
    class="button button--icon"
    type="button"
    :class="props.class"
    :disabled="props.disabled || props.isLoading"
    @click="emits('click', $event)"
  >
    <Icon class="button__loader" :icon="props.icon" />
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
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  &__loader {
    font-size: 2rem;
  }

  &--icon {
    background: transparent;
    width: fit-content;
    height: fit-content;
    padding: 0;
  }
}
</style>
