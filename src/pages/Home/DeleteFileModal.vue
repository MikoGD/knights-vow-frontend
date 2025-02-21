<script lang="ts" setup>
import Modal from '@/components/Modal.vue';

const props = defineProps<{
  show: boolean;
  isLoading: boolean;
}>();

const emits = defineEmits<{
  deleteFile: [];
  close: [];
}>();
</script>
<template>
  <Modal
    confirm
    center-modal-content
    header="Delete file"
    :show="props.show"
    :is-confirm-loading="props.isLoading"
    @confirm="emits('deleteFile')"
    @close="emits('close')"
  >
    <p>Are you sure you want to delete this file?</p>
  </Modal>
</template>
