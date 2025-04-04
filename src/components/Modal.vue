<script lang="ts" setup>
import Button from '@/components/Button/Button.vue';

const props = withDefaults(
  defineProps<{
    header: string;
    show: boolean;
    /** Shows confirm button which emits confirm event  */
    confirm?: boolean;
    /** Shows loader on confirm button for async requests */
    isConfirmLoading?: boolean;
    centerModalContent?: boolean;
  }>(),
  {
    confirm: false,
    centerModalContent: false,
  },
);

const emits = defineEmits<{
  close: [];
  confirm: [];
}>();
</script>
<template>
  <section v-if="show" class="modal" @click="() => emits('close')">
    <div class="modal__card" @click.stop>
      <div class="modal__card-header">
        <div class="modal__header-label">{{ props.header }}</div>
      </div>
      <div
        class="modal__card-content"
        :class="props.centerModalContent && 'modal__card-content--center'"
      >
        <slot />
      </div>
      <div class="modal__card-actions">
        <Button
          type="button"
          class="modal__actions-close-btn"
          size="small"
          @click="() => emits('close')"
        >
          {{ props.confirm ? 'Cancel' : 'Close' }}
        </Button>
        <Button
          v-if="props.confirm"
          type="button"
          class="modal__actions-confirm-btn"
          size="small"
          :is-loading="props.isConfirmLoading"
          @click="() => emits('confirm')"
        >
          Confirm
        </Button>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
@use '@/styles/variables/colors';
@use '@/styles/utils';

.modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 0 1rem;

  &__card {
    @include utils.column;

    width: 100%;
    max-height: 50vh;
    background-color: colors.$white;
    border-radius: 0.5rem;
    padding: 1rem 1rem;

    &-header {
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;

      &-label {
        font-size: 1.5rem;
      }
    }

    &-content {
      width: 100%;
      background-color: #fff;
      min-height: 10rem;

      &--center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    &-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
    }
  }
}
</style>
