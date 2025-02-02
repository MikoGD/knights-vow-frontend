<script lang="ts" setup>
import { debounceFunction } from '@/utils/debounce';

export interface FieldClasses {
  field?: string;
}

const props = defineProps<{
  id: string;
  class?: string;
  placeholder?: string;
  disabled?: boolean;
  debounce?: number;
}>();
const model = defineModel<string>({ required: true });
const emits = defineEmits<{
  focus: [FocusEvent];
  blur: [FocusEvent];
  input: [Event];
}>();

let inputDebounce: (...args: unknown[]) => void;

/**
 * Handle onChange event
 * @param event Event emitted
 */
function handleOnInput(event: Event) {
  if (!props.debounce) {
    emits('input', event);
  }

  if (!inputDebounce) {
    inputDebounce = debounceFunction(
      (...args: unknown[]) => emits('input', ...(args as [Event])),
      props.debounce,
    );
  }

  inputDebounce(event);
}
</script>
<template>
  <input
    :id="props.id"
    v-model="model"
    class="field__input"
    type="text"
    :class="props.class"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    @blur="emits('blur', $event)"
    @focus="emits('focus', $event)"
    @input="handleOnInput"
  />
</template>
<style lang="scss" scoped>
@use '@/styles/utils';
@use '@/styles/variables/colors';

.field {
  @include utils.column;

  min-height: 8.25rem;
  width: 100%;

  &__input {
    height: 3.5rem;
    width: 100%;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
    border: none;
    border: 1px solid colors.$border-color;
    border-radius: 0.3125rem;
    font-size: 1rem;
  }
}
</style>
