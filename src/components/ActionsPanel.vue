<script lang="ts" setup>
import { Icon } from '@iconify/vue';

export interface Action {
  icon: string;
  label: string;
  onClick: () => void;
}

const props = defineProps<{
  header: string;
  actions: Action[];
  show: boolean;
}>();

const emits = defineEmits<{
  close: [];
}>();
</script>
<template>
  <section v-if="props.show" class="actions-panel" @click="emits('close')">
    <div class="actions-panel__card" @click.stop>
      <div class="actions-panel__card-header">
        <h3>{{ props.header }}</h3>
      </div>
      <div class="actions-panel__actions">
        <div
          v-for="action in props.actions"
          :key="action.label"
          class="actions-panel__action"
          @click="action.onClick"
        >
          <Icon class="actions-panel__action-icon" :icon="action.icon" />
          <span class="actions-panel__action-label">{{ action.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/colors';
@use '@/styles/utils';

.actions-panel {
  @include utils.column;
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  justify-content: end;

  &__card {
    width: 100%;
    height: 40vh;
    padding: 1.4rem;
    background-color: colors.$white;
    border-top-left-radius: 1.2rem;
    border-top-right-radius: 1.2rem;
    box-shadow: 0 -0.125rem 0.5rem rgba(0, 0, 0, 0.3);
  }

  &__card-header {
    margin-bottom: 1.5rem;

    & h3 {
      font-size: 1.2rem;
      font-weight: 300;
    }
  }

  &__actions {
    @include utils.column;
    padding: 0 1rem;
    gap: 1rem;
  }

  &__action {
    display: flex;
    align-items: center;
    cursor: pointer;

    &-icon {
      font-size: 1.3rem;
      margin-right: 0.75rem;
    }

    &-label {
      font-size: 1.3rem;
    }
  }
}
</style>
