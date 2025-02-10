<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns';

export interface FileCellProps {
  fileName: string;
  ownerUsername: string;
  createdDate: string;
}

const props = defineProps<FileCellProps>();
</script>
<template>
  <div class="file-cell">
    <span class="file-cell__name">{{ props.fileName }}</span>
    <span class="file-cell__meta">
      {{ props.ownerUsername }} - {{ formatDistanceToNow(props.createdDate) }} ago
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables/colors';

.file-cell {
  display: flex;
  flex-direction: column;
  flex-basis: 85%;

  & span.file-cell__name {
    display: inline-block;
    max-width: 16rem; // or desired width
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & span.file-cell__meta {
    font-size: 0.9rem;
    font-weight: 300;
    color: colors.$text-secondary;
  }
}
</style>
