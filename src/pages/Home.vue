<script lang="ts" setup>
import Button from '@/components/Button.vue';
import SearchInput from '@/components/SearchInput.vue';
import ComponentLoader from '@/components/loader/ComponentLoader.vue';
import ActionsPanel from '@/components/ActionsPanel.vue';
import { useRequests } from '@/composables';
import { Icon } from '@iconify/vue';
import { formatDistanceToNow } from 'date-fns';
import { onMounted, ref, useTemplateRef } from 'vue';

interface FileRecord {
  id: number;
  name: string;
  createdDate: string;
  ownerID: number;
  ownerUsername: string;
}

interface GetUploadsResponse {
  count: number;
  files: FileRecord[];
}

const { get, uploadFile: uploadFileSocket, downloadFile: downloadFileSocket } = useRequests();
const fileToUpload = ref<File | null>(null);
const inputFileRef = useTemplateRef<HTMLInputElement>('input-file-ref');
const searchModel = ref('');
const isLoading = ref(true);
const selectedFile = ref<FileRecord | null>(null);
const showActionsPanel = ref(false);

// const isLoading = ref(false);
const files = ref<FileRecord[]>([]);

/**
 * Handles downloading a file
 * @param file File to download
 */
async function handleDownloadFile() {
  if (!selectedFile.value) return;

  await downloadFileSocket(Number(selectedFile.value.id));
}

/**
 * Handles event where file is added to input. File will be sent through web socket
 * @param event Event emitted
 */
async function handleFileAdded(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    await uploadFileSocket(files[0]);
    fileToUpload.value = null;
  }
}

/**
 * Handles opening the file explorer to add a file to input
 */
function handleUploadFile() {
  inputFileRef.value?.click();
}

/**
 * Handles searching for files with name entered. Sends a request to the server.
 */
async function handleSearchInput() {
  isLoading.value = true;
  let responseData: GetUploadsResponse;

  if (searchModel.value === '') {
    responseData = await get<GetUploadsResponse>('/files');
  } else {
    responseData = await get<GetUploadsResponse>(`/files?fileName=${searchModel.value}`);
  }

  files.value = responseData.files;
  isLoading.value = false;
}

/**
 *
 * @param file
 */
function onMoreOptionsClick(file: FileRecord) {
  selectedFile.value = file;
  showActionsPanel.value = true;
}

onMounted(async () => {
  const responseData = await get<GetUploadsResponse>('/files');
  files.value = responseData.files;
  isLoading.value = false;
});
</script>
<template>
  <section class="home">
    <div class="file-search">
      <input
        ref="input-file-ref"
        type="file"
        class="file-search__upload-input"
        @change="handleFileAdded"
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
        @click="handleUploadFile"
      >
        Upload
      </Button>
    </div>
    <ComponentLoader :is-loading="isLoading">
      <div class="file-list">
        <div class="file-list__headers">
          <div class="file-list__headers-cell file-name-header">Files</div>
          <div class="file-list__headers-cell actions-header">&nbsp;</div>
        </div>
        <div v-if="!isLoading" class="file-list__body">
          <div v-for="file of files" :key="file.id" class="file-list__row">
            <div class="file-list__row-cell file-name-cell">
              <span class="file-name-cell__file">{{ file.name }}</span>
              <span class="file-name-cell__owner"
                >{{ file.ownerUsername }} - {{ formatDistanceToNow(file.createdDate) }} ago</span
              >
            </div>
            <div class="file-list__row-cell actions-cell">
              <Icon icon="material-symbols:more-vert" @click="() => onMoreOptionsClick(file)" />
            </div>
          </div>
        </div>
      </div>
    </ComponentLoader>
  </section>
  <ActionsPanel
    header="File actions"
    :show="showActionsPanel"
    :actions="[
      {
        label: 'Download',
        icon: 'material-symbols:download',
        onClick: handleDownloadFile,
      },
      {
        label: 'Delete',
        icon: 'material-symbols:delete',
        onClick: () => console.log('Delete'),
      },
    ]"
    @close="
      () => {
        showActionsPanel = false;
        selectedFile = null;
      }
    "
  />
</template>
<style lang="scss" scoped>
@use '@/styles/variables/colors';
@use '@/styles/utils';

.home {
  height: 100%;
  width: 100%;
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

.file-list {
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

      &.file-name-header {
        flex-basis: 85%;
      }

      &.actions-header {
        flex-basis: 15%;
      }
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

    &:first-child {
      padding-top: 0;
    }

    &-cell {
      font-size: 1.25rem;

      &.file-name-cell {
        display: flex;
        flex-direction: column;
        flex-basis: 85%;

        & span.file-name-cell__file {
          display: inline-block;
          max-width: 16rem; // or desired width
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        & span.file-name-cell__owner {
          font-size: 0.9rem;
          font-weight: 300;
          color: colors.$text-secondary;
        }
      }

      &.actions-cell {
        flex-basis: 15%;
        text-align: right;
        display: flex;
        justify-content: end;
        align-items: center;
        padding-top: 0.2rem;
      }
    }
  }
}
</style>
