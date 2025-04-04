<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { toRefs, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    isLoading?: boolean;
    disabled?: boolean;
    type?: 'submit' | 'button' | 'icon';
    icon?: string;
    class?: string;
    size?: 'small';
  }>(),
  {
    isLoading: false,
    type: 'button',
  },
);

const { type, icon } = toRefs(props);

watch([type, icon], ([newType, newIcon]) => {
  if (newType === 'icon' && !!newIcon === false)
    throw new Error('Button type is icon but icon is not set');
});

const emits = defineEmits<{
  click: [MouseEvent];
}>();
</script>
<template>
  <button
    v-if="props.type !== 'icon'"
    class="button"
    :class="[props.class, props.size && `button--${props.size}`]"
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
    :class="[props.class, props.size && `button--${props.size}`]"
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
  background-color: colors.$white;
  padding: 0.5rem 1rem;
  border: 1px solid colors.$black;
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
    border: none;
    width: fit-content;
    height: fit-content;
    padding: 0;
  }

  &--small {
    width: 6rem;
    height: 2.5rem;
    font-size: 0.9rem;
  }
}
</style>
