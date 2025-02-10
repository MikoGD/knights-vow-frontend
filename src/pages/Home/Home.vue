<script lang="ts" setup>
import Button from '@/components/Button.vue';
import SearchInput from '@/components/SearchInput.vue';
import ActionsPanel from '@/components/ActionsPanel.vue';
import Modal from '@/components/Modal.vue';
import List from '@/components/list/List.vue';
import { useFileList } from './use-file';

const {
  searchModel,
  isLoading,
  showActionsPanel,
  modalOptions,
  listItems,
  listHeaders,
  panelActions,
  handleFileAddedToInput,
  handleUploadFileClick,
  handleSearchInput,
  deleteFile,
  closeModal,
  closeActionsPanel,
} = useFileList();
</script>
<template>
  <section class="home">
    <div class="file-search">
      <input
        ref="input-file-ref"
        type="file"
        class="file-search__upload-input"
        @change="handleFileAddedToInput"
      />
      <SearchInput
        id="files-search-input"
        v-model="searchModel"
        class="file-search__search-input"
        placeholder="Search..."
        :debounce="500"
        @input="handleSearchInput"
      />
      <Button
        class="file-search__upload-btn"
        type="icon"
        icon="material-symbols:upload-2-rounded"
        @click="handleUploadFileClick"
      >
        Upload
      </Button>
    </div>
    <List
      :items="listItems"
      :headers="listHeaders"
      :is-loading="isLoading.getFiles"
      class="file-list"
    />
  </section>
  <Teleport to="#app">
    <ActionsPanel
      header="File actions"
      :show="showActionsPanel"
      :actions="panelActions"
      @close="closeActionsPanel"
    />
    <Modal
      confirm
      center-modal-content
      :show="modalOptions.show"
      :header="modalOptions.header ?? ''"
      :is-confirm-loading="isLoading.deleteFile"
      @confirm="deleteFile"
      @close="closeModal"
    >
      <p>
        {{ modalOptions.body }}
      </p>
    </Modal>
  </Teleport>
</template>
<style lang="scss" scoped>
@use '@/styles/variables/colors';
@use '@/styles/utils';

.home {
  height: 100%;
  width: 100%;

  :deep(.file-list) {
    width: 100%;
    min-height: 70vh;
  }
}

.file-search {
  position: sticky;
  display: flex;
  top: 0;
  justify-content: end;
  align-items: center;
  padding: 1rem 0;
  width: 100%;
  background-color: colors.$white;

  &__upload-input {
    display: none;
  }

  :deep(.file-search__search-input) {
    padding-right: 3rem !important;
    border-radius: 2rem !important;
  }

  :deep(.file-search__upload-btn) {
    position: absolute;
    right: 1rem;
  }
}
</style>
