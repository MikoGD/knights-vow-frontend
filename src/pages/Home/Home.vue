<script lang="ts" setup>
import { reactive } from 'vue';
import Button from '@/components/Button.vue';
import SearchInput from '@/components/SearchInput.vue';
import ActionsPanel from '@/components/ActionsPanel.vue';
import Modal from '@/components/Modal.vue';
import List from '@/components/list/List.vue';
import { useFileList } from './use-file';

const {
  searchModel,
  isLoading,
  selectedFile,
  showActionsPanel,
  downloadFile,
  handleFileAddedToInput,
  handleUploadFileClick,
  handleDeleteFileClick,
  handleSearchInput,
  deleteFile,
  listItems,
  listHeaders,
} = useFileList();

const modalOptions = reactive({
  show: false,
  header: null,
  body: null,
});

/**
 *
 */
function handleModalClose() {
  modalOptions.show = false;
  modalOptions.header = null;
  modalOptions.body = null;
}
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
      :actions="[
        {
          label: 'Download',
          icon: 'material-symbols:download',
          onClick: downloadFile,
        },
        {
          label: 'Delete',
          icon: 'material-symbols:delete',
          onClick: handleDeleteFileClick,
        },
      ]"
      @close="
        () => {
          showActionsPanel = false;
          selectedFile = null;
        }
      "
    />
    <Modal
      confirm
      center-modal-content
      :show="modalOptions.show"
      :header="modalOptions.header ?? ''"
      :is-confirm-loading="isLoading.deleteFile"
      @confirm="deleteFile"
      @close="handleModalClose"
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

    // &__headers {
    //   height: 2rem;
    //   display: flex;
    //   align-items: center;
    //   margin-bottom: 0.5rem;

    //   &-cell {
    //     text-align: left;
    //     font-size: 0.9rem;
    //     font-weight: 300;

    //     &.file-name-header {
    //       flex-basis: 85%;
    //     }

    //     &.actions-header {
    //       flex-basis: 15%;
    //     }
    //   }
    // }

    // &__body {
    //   @include utils.column;
    //   overflow-y: auto;
    //   max-height: 75vh;
    // }

    // &__row {
    //   width: 100%;
    //   border-bottom: 1px solid colors.$border-secondary-color;
    //   padding-top: 0.5rem;
    //   padding-bottom: 0.5rem;
    //   display: flex;

    //   &:first-child {
    //     padding-top: 0;
    //   }

    //   &-cell {
    //     font-size: 1.25rem;

    //     &.file-name-cell {
    //       display: flex;
    //       flex-direction: column;
    //       flex-basis: 85%;

    //       & span.file-name-cell__file {
    //         display: inline-block;
    //         max-width: 16rem; // or desired width
    //         white-space: nowrap;
    //         overflow: hidden;
    //         text-overflow: ellipsis;
    //       }

    //       & span.file-name-cell__owner {
    //         font-size: 0.9rem;
    //         font-weight: 300;
    //         color: colors.$text-secondary;
    //       }
    //     }

    //     &.actions-cell {
    //       flex-basis: 15%;
    //       text-align: right;
    //       display: flex;
    //       justify-content: end;
    //       align-items: center;
    //       padding-top: 0.2rem;
    //     }
    //   }
    // }
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
