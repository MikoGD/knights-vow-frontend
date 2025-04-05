<script lang="ts" setup>
import Button from '@/components/Button/Button.vue';
import { onBeforeUnmount, reactive, nextTick } from 'vue';
import { EventData, useEvents } from '@/composables/useEvents';

export interface UploadProgressEvent extends EventData {
  fileName: string;
  uploadPercentage: number;
  progressBarElemID: string;
}

const files: UploadProgressEvent[] = reactive([
  {
    fileName: 'test-file-1.txt',
    uploadPercentage: 42,
    progressBarElemID: 'test-file-1',
  },
  {
    fileName: 'test-file-2.txt',
    uploadPercentage: 69,
    progressBarElemID: 'test-file-2',
  },
  {
    fileName: 'test-file-3.txt',
    uploadPercentage: 100,
    progressBarElemID: 'test-file-3',
  },
]);

const { subscribe, unsubscribe } = useEvents();

/**
 * Update the file progress bar. Gets the progress bar by it's ID which is based off the file name.
 * Increases width based off the percentage uploaded.
 * @param fileNameID ID of the file progress element. Based off file name
 * @param percentage Percentage of the file uploaded
 */
function updateFileProgressBar(fileNameID: string, percentage: number) {
  const progressBarElem = document.getElementById(fileNameID);
  if (!progressBarElem) return;
  progressBarElem.style.width = `${percentage}%`;
}

/**
 * Removes file from files list
 * @param file - file to remove
 */
function removeFile(file: UploadProgressEvent) {
  const index = files.findIndex((f) => f.fileName === file.fileName);
  files.splice(index, 1);
}

const subscriberID = subscribe<UploadProgressEvent>('file-upload-progress', (event) => {
  if (!event) return;

  const fileProgress = files.find((fp) => fp.fileName === event.fileName);
  if (fileProgress) {
    fileProgress.uploadPercentage = event.uploadPercentage;
    updateFileProgressBar(fileProgress.progressBarElemID, event.uploadPercentage);
    return;
  }

  const newFile = { ...event, progressBarElemID: event.fileName.replace(' ', '-') };
  files.push(newFile);
  nextTick(() => {
    updateFileProgressBar(newFile.progressBarElemID, newFile.uploadPercentage);
  });
});

onBeforeUnmount(() => {
  unsubscribe('file-upload-progress', subscriberID);
});
</script>
<template>
  <Teleport to="#app">
    <section v-if="files.length > 0" class="progress-dialog">
      <h3 class="progress-dialog__header">Uploading...</h3>
      <div class="progress-dialog__progresses">
        <div v-for="file in files" :key="file.fileName" class="progress-dialog__progress">
          <div class="progress-dialog__progress-item">
            <span class="progress-dialog__progress-file-name">{{ file.fileName }}</span>
            <span v-if="file.uploadPercentage !== 100" class="progress-dialog__progress-percentage">
              {{ file.uploadPercentage }}%
            </span>
            <div v-if="file.uploadPercentage === 100" class="progress-dialog__progress-done">
              <span class="progress-dialog__progress-done-label">Done</span>
              <Button
                class="progress-dialog__progress-done-close"
                type="icon"
                icon="material-symbols:close-small-rounded"
                @click="() => removeFile(file)"
              >
                Close
              </Button>
            </div>
          </div>
          <div class="progress-dialog__progress-bar">
            <div :id="file.progressBarElemID" class="progress-dialog__progress-bar-fill">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </section>
  </Teleport>
</template>
<style lang="scss" scoped>
.progress-dialog {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  min-height: 5rem;
  padding: 0.5rem 0.5rem;
  width: 15rem;
  z-index: 980;
  border: 1px solid black;
  border-radius: 0.3125rem;
  box-shadow: 0 0.125rem 0.05rem 0.002rem rgba(0, 0, 0, 0.4);

  &__header {
    margin-bottom: 0.5rem;
  }

  &__progresses {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__progress {
    &-bar {
      width: 100%;
      height: 0.4rem;
      position: relative;
      border-radius: 0.3125rem;
      border: 1px solid black;
      overflow: hidden;

      &-fill {
        transition: width 100ms;
        background-color: black;
        height: 100%;
      }
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.8rem;
    }

    &-file-name {
      width: 75%;
      max-width: 75%;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;
      white-space: nowrap;
    }

    &-percentage {
      display: inline-block;
    }

    &-done {
      display: flex;
      align-items: center;
    }

    & :deep(.progress-dialog__progress-done-close) {
      height: 1.8rem;
      width: 1.8rem;
    }
  }
}
</style>
