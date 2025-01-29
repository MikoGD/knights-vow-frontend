<script lang="ts" setup>
import Button from '@/components/Button.vue';
import { useRequests } from '@/composables';
import { Icon } from '@iconify/vue';
import { formatDistanceToNow } from 'date-fns';
import { onMounted, ref } from 'vue';

interface FileRecord {
  id: string;
  name: string;
  createdDate: string;
  ownerID: string;
  ownerUsername: string;
}

interface GetUploadsResponse {
  count: number;
  files: FileRecord[];
}

const { get, uploadFile: uploadFileSocket, downloadFile: downloadFileSocket } = useRequests();
const fileToUpload = ref<File | null>(null);

// const isLoading = ref(false);
const files = ref<FileRecord[]>([]);

/**
 *
 * @param file
 */
async function handleDownloadFile(file: FileRecord) {
  await downloadFileSocket(Number(file.id));
}

/**
 *
 * @param event
 */
async function handleFileAdded(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    fileToUpload.value = files[0];
  }
}

/**
 *
 */
async function handleUploadFile() {
  if (fileToUpload.value) {
    await uploadFileSocket(fileToUpload.value);
    fileToUpload.value = null;
  }
}

onMounted(async () => {
  const responseData = await get<GetUploadsResponse>('/files');
  files.value = responseData.files;
});
</script>
<template>
  <section class="home">
    <div class="file-list">
      <div class="file-list__headers">
        <div class="file-list__headers-cell file-name-header">Files</div>
        <div class="file-list__headers-cell created-date-header">Created date</div>
        <div class="file-list__headers-cell actions-header">&nbsp;</div>
      </div>
      <div class="file-list__body">
        <div v-for="file of files" :key="file.id" class="file-list__row">
          <div class="file-list__row-cell file-name-cell">
            <span class="file-name-cell__file">{{ file.name }}</span>
            <span class="file-name-cell__owner">{{ file.ownerUsername }}</span>
          </div>
          <div class="file-list__row-cell created-date-cell">
            {{ formatDistanceToNow(file.createdDate) }}
          </div>
          <div class="file-list__row-cell actions-cell">
            <Icon
              icon="material-symbols:download-2-rounded"
              @click="() => handleDownloadFile(file)"
            />
            <Icon icon="material-symbols:delete-outline-rounded" />
          </div>
        </div>
      </div>
    </div>
    <input type="file" class="home__upload-input" @change="handleFileAdded" />
    <Button class="home__upload-btn" @click="handleUploadFile">Upload</Button>
  </section>
</template>
<style lang="scss" scoped>
@use '@/styles/variables/colors';

.home {
  height: 100%;
  width: 100%;
}

.file-list {
  width: 100%;
  border-collapse: separate;

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
        flex-basis: 45%;
      }

      &.created-date-header {
        flex-basis: 40%;
      }

      &.actions-header {
        flex-basis: 15%;
      }
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
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
        flex-basis: 45%;

        & span.file-name-cell__owner {
          font-size: 0.9rem;
          font-weight: 300;
          color: colors.$text-secondary;
        }
      }

      &.created-date-cell {
        flex-basis: 40%;
      }

      &.actions-cell {
        flex-basis: 15%;
        text-align: right;
        display: flex;
        justify-content: space-between;
        align-items: start;
        padding-top: 0.2rem;
      }
    }
  }
}
</style>
