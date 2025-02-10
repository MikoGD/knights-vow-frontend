import { useRequests } from '@/composables/useRequests';
import { reactive, ref, shallowRef, StyleValue, useTemplateRef } from 'vue';
import { Icon } from '@iconify/vue';
import { CustomCell, ListHeader, ListItem } from '@/components/list/List.vue';
import FileCell from './FileCell.vue';

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

interface ModalOptions {
  show: boolean;
  header: string | null;
  body: string | null;
}

/**
 * Composable to encapsulate all file related functionality. Immediately fetches files when called.
 * @returns Helper functions and variables
 */
export function useFileList() {
  const isLoading = reactive({
    getFiles: false,
    deleteFile: false,
  });
  const selectedFile = ref<FileRecord | null>(null);
  const files = ref<FileRecord[]>([]);
  const searchModel = ref('');
  const inputFileRef = useTemplateRef<HTMLInputElement>('input-file-ref');
  const showActionsPanel = ref(false);
  const modalOptions = reactive<ModalOptions>({
    show: false,
    header: '',
    body: '',
  });
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

  const panelActions = [
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
  ];

  const { get, del, upload, download } = useRequests();

  /**
   * Handles clicking on more options icon for a file record
   * @param file File record that more options was clicked for
   */
  function handleMoreOptionsClick(file: FileRecord): void {
    selectedFile.value = file;
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

    if (inputFiles && inputFiles.length > 0) {
      await upload(inputFiles[0]);
      files.value = await getFiles();
      createList(files.value);
    }
  }

  /**
   * Handles opening the file explorer to add a file to input
   */
  async function handleUploadFileClick() {
    inputFileRef.value?.click();
  }

  /**
   * Handles searching for files with name entered. Sends a request to the server.
   */
  async function handleSearchInput() {
    files.value = await getFiles(searchModel.value);
    createList(files.value);
  }

  /**
   * Handles delete file click by opening modal for delete confirmation
   */
  function handleDeleteFileClick() {
    modalOptions.show = true;
    modalOptions.header = 'Delete file';
    modalOptions.body = 'Are you sure you want to delete this file?';
  }

  /**
   * Closes modal
   */
  function closeModal() {
    modalOptions.show = false;
    modalOptions.header = null;
    modalOptions.body = null;
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
  }

  // Initialize
  (async () => {
    files.value = await getFiles();
    createList(files.value);
  })();

  return {
    searchModel,
    isLoading,
    listItems,
    listHeaders,
    showActionsPanel,
    modalOptions,
    panelActions,
    handleFileAddedToInput,
    handleUploadFileClick,
    handleSearchInput,
    deleteFile,
    closeModal,
    closeActionsPanel,
  };
}
