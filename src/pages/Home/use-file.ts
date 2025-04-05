import { useRequests } from '@/composables/useRequests';
import { reactive, Ref, ref, shallowRef, StyleValue, useTemplateRef } from 'vue';
import { Icon } from '@iconify/vue';
import { CustomCell, ListHeader, ListItem } from '@/components/list/List.vue';
import FileCell from './FileCell.vue';
import { Action } from '@/components/ActionsPanel.vue';

export interface FileRecord {
  id: number;
  name: string;
  createdDate: string;
  ownerID: number;
  ownerUsername: string;
}

export interface GetUploadsResponse {
  count: number;
  files: FileRecord[];
}

/**
 * Composable to encapsulate all file related functionality. Immediately fetches files when called.
 * @returns Helper functions and variables
 */
export function useFileList() {
  const { get, del, upload, download } = useRequests();

  const isLoading = reactive({
    getFiles: false,
    deleteFile: false,
  });
  const selectedFile = ref<FileRecord | null>(null);
  const files = ref<FileRecord[]>([]);
  const searchModel = ref('');
  const inputFileRef = useTemplateRef<HTMLInputElement>('input-file-ref');
  const showActionsPanel = ref(false);
  const listItems = shallowRef<ListItem[][]>([]);
  const listHeaders: ListHeader[] = [
    {
      id: 'file-name',
      display: 'File',
      class: 'file-list-header file-list-header__file',
    },
    {
      id: 'actions',
      display: '',
      class: 'file-list-header file-list-header__actions',
    },
  ];
  const selectedActionConfiguration: Ref<Action[] | null> = ref(null);
  const showDeleteModal = ref(false);

  const panelActionConfiguration: Record<string, Action[]> = {
    file: [
      {
        label: 'Download',
        icon: 'material-symbols:download',
        onClick: downloadFile,
      },
      {
        label: 'Delete',
        icon: 'material-symbols:delete',
        onClick: () => {
          showDeleteModal.value = true;
        },
      },
    ],
    upload: [
      {
        label: 'File',
        icon: 'material-symbols:upload-file',
        onClick: () => {
          inputFileRef.value?.click();
        },
      },
    ],
  };

  /**
   * Handles clicking on more options icon for a file record
   * @param file File record that more options was clicked for
   */
  function handleMoreOptionsClick(file: FileRecord): void {
    selectedFile.value = file;
    selectedActionConfiguration.value = panelActionConfiguration.file;
    showActionsPanel.value = true;
  }

  /**
   * Creates lists from files to display
   * @param files Files to create list
   */
  function createList(files: FileRecord[]): void {
    const items: ListItem[][] = files.map((file) => {
      return [
        {
          id: `file-${file.id}`,
          display: {
            component: FileCell,
            props: {
              fileName: file.name,
              ownerUsername: file.ownerUsername,
              createdDate: file.createdDate,
            },
          },
          class: 'file-list-cell file-list-cell__file',
          style: {
            width: '90%',
          } as StyleValue,
        },
        {
          id: `acitons-${file.id}`,
          display: {
            component: Icon,
            props: {
              icon: 'material-symbols:more-vert',
            },
            emits: {
              click: () => handleMoreOptionsClick(file),
            },
          } as CustomCell,
          style: {
            width: '10%',
          } as StyleValue,
        },
      ];
    });

    listItems.value = items;
  }

  /**
   * Get files from server. If fileName is provided, only files with that name will be returned
   * @param fileName File name to filter for
   * @returns Files retrieved
   */
  async function getFiles(fileName?: string): Promise<FileRecord[]> {
    let responseData: GetUploadsResponse;

    if (!fileName || fileName === '') {
      responseData = await get<GetUploadsResponse>('/files');
    } else {
      responseData = await get<GetUploadsResponse>(`/files?fileName=${fileName}`);
    }

    return responseData.files;
  }

  /**
   * Handles downloading a file
   */
  async function downloadFile(): Promise<void> {
    if (!selectedFile.value) return;

    await download(Number(selectedFile.value.id));
  }

  /**
   * Handles event where file is added to input. File will be sent through web socket
   * @param event Event emitted
   */
  async function handleFileAddedToInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const inputFiles = target.files;
    closeActionsPanel();

    if (inputFiles && inputFiles.length > 0) {
      await upload(inputFiles[0]);
      files.value = await getFiles();
      createList(files.value);
    }
  }

  /**
   * Handles opening the file explorer to add a file to input
   */
  async function openUploadActionsPanel() {
    selectedActionConfiguration.value = panelActionConfiguration.upload;
    showActionsPanel.value = true;
  }

  /**
   * Handles searching for files with name entered. Sends a request to the server.
   */
  async function handleSearchInput() {
    files.value = await getFiles(searchModel.value);
    createList(files.value);
  }

  /**
   * Closes modal
   */
  function closeModal() {
    showDeleteModal.value = false;
  }

  /**
   * Sends request to delete file and refreshes files list
   */
  async function deleteFile() {
    if (!selectedFile.value) return;

    isLoading.deleteFile = true;
    await del(`/files/${selectedFile.value.id}`);
    isLoading.deleteFile = false;

    showActionsPanel.value = false;
    closeModal();
    selectedFile.value = null;

    isLoading.getFiles = true;
    files.value = await getFiles();
    createList(files.value);
    isLoading.getFiles = false;
  }

  /**
   * Closes actions panel and resets selected file
   */
  function closeActionsPanel() {
    showActionsPanel.value = false;
    selectedFile.value = null;
    selectedActionConfiguration.value = null;
  }

  // Initialize
  (async () => {
    files.value = await getFiles();
    createList(files.value);
  })();

  return {
    // Reactive variables
    searchModel,
    isLoading,
    listItems,
    listHeaders,
    showActionsPanel,
    showDeleteModal,
    selectedActionConfiguration,
    selectedFile,
    // Functions
    handleFileAddedToInput,
    openUploadActionsPanel,
    handleSearchInput,
    deleteFile,
    closeActionsPanel,
    closeModal,
  };
}
