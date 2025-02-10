<script lang="ts" setup>
import { StyleValue, type Component } from 'vue';
import ComponentLoader from '@/components/loader/ComponentLoader.vue';

export interface CustomCell<T extends Record<string, unknown> = Record<string, unknown>> {
  component: Component;
  props?: T;
  emits?: Record<string, (...args: unknown[]) => void>;
  class?: string;
  style?: StyleValue;
}

export interface ListItem<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  /** Data to display in the cell. Can be a simple string or number or a complex custom component */
  display: number | string | CustomCell<T>;
  class?: string;
  style?: StyleValue;
}

export interface ListHeader {
  id: string;
  /** String to display as header */
  display: string;
  class?: string;
}

const props = defineProps<{
  items: ListItem[][];
  headers: ListHeader[];
  /** Action icon button that is displayed at end of search */
  isLoading?: boolean;
  class?: string;
}>();

/**
 * Check if display is a Component or string/number
 * @param display ListItem display property to check
 * @returns True if display is a Component, false otherwise
 */
function isCustomCell(display: unknown): boolean {
  if (typeof display !== 'string' && typeof display !== 'number') {
    return true;
  }

  return false;
}
</script>
<template>
  <ComponentLoader :is-loading="props.isLoading">
    <div class="list-list" :class="props.class">
      <div class="list-list__headers">
        <div
          v-for="header in props.headers"
          :key="header.display"
          class="list-list__headers-cell list-name-header"
          :class="header.class"
        >
          {{ header.display }}
        </div>
      </div>
      <div v-if="!isLoading" class="list-list__body">
        <div v-for="row of props.items" :key="row[0].id" class="list-list__row">
          <div
            v-for="cell of row"
            :key="cell.id"
            class="list-list__row-cell"
            :class="cell.class"
            :style="cell.style"
          >
            <Component
              :is="(cell.display as CustomCell).component"
              v-if="isCustomCell(cell.display)"
              v-bind="(cell.display as CustomCell).props"
              :class="(cell.display as CustomCell).class"
              :style="(cell.display as CustomCell).style"
              v-on="(cell.display as CustomCell).emits || {}"
            />
            <div v-else>
              {{ cell.display }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ComponentLoader>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/colors';
@use '@/styles/utils';

.list-search {
  position: sticky;
  display: flex;
  top: 0;
  justify-content: end;
  align-items: center;
  padding: 1rem 0;
  width: 100%;
  background-color: colors.$white;
}

.list-list {
  width: 100%;
  border-collapse: separate;
  min-height: 70vh;

  &__headers {
    height: 2rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    &-cell {
      text-align: left;
      font-size: 0.9rem;
      font-weight: 300;
    }
  }

  &__body {
    @include utils.column;
    overflow-y: auto;
    max-height: 75vh;
  }

  &__row {
    width: 100%;
    border-bottom: 1px solid colors.$border-secondary-color;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;

    &:first-child {
      padding-top: 0;
    }

    &-cell {
      font-size: 1.25rem;
    }
  }
}
</style>
