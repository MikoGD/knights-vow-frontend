<script lang="ts" setup>
export interface FieldClasses {
  field?: string;
  input?: string;
  label?: string;
  subLabel?: string;
  errorMessage?: string;
}

const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    errorMessage?: string;
    classes?: {
      field?: string;
      input?: string;
      label?: string;
      subLabel?: string;
      errorMessage?: string;
    };
    placeholder?: string;
    subLabel?: string;
    type?: string;
    disabled?: boolean;
  }>(),
  {
    type: 'text',
  },
);
const model = defineModel<string>({ required: true });
const emits = defineEmits<{
  focus: [FocusEvent];
  blur: [FocusEvent];
}>();
</script>
<template>
  <div class="login__form-username field" :class="props.classes?.field">
    <label class="field__label" :class="props.classes?.label" :for="props.id">{{
      props.label
    }}</label>
    <input
      v-model="model"
      class="field__input"
      :id="props.id"
      :class="props.classes?.input"
      :placeholder="props.placeholder"
      :type="props.type"
      :disabled="props.disabled"
      @blur="emits('blur', $event)"
      @focus="emits('focus', $event)"
    />
    <span
      v-if="props.errorMessage"
      class="field__sub-label field__sub-label--error"
      :class="props.classes?.errorMessage"
    >
      Sub-label
    </span>
    <span
      v-if="props.subLabel"
      class="field__sub-label"
      :class="props.classes?.subLabel"
    >
      Sub-label
    </span>
  </div>
</template>
<style lang="scss" scoped>
@use '@styles/utils';
@use '@styles/variables/colors';

.field {
  @include utils.column;

  min-height: 8.25rem;
  width: 100%;

  &__label {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }

  &__input {
    height: 3.5rem;
    width: 100%;
    margin-bottom: 0.4rem;
    padding-left: 0.8rem;
    border: none;
    border: 1px solid colors.$border-color;
    border-radius: 0.3125rem;
    font-size: 1rem;
  }

  &__sub-label {
    font-size: 0.9rem;
    font-weight: 300;

    &--error {
      font-style: italic;
    }
  }
}
</style>
