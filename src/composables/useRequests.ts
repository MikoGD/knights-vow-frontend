import { useAuthenticationStore } from '@/stores/authentication.store';
import axios, { AxiosRequestConfig } from 'axios';
import { useWebSockets } from './useWebSockets';
import { useEvents } from './useEvents';
import type { UploadProgressEvent } from '@/pages/Home/ProgressDialog.vue';

const CHUNK_SIZE = 1024 * 1024;
// const API_BASE_URL = 'http://191.168.68.100:8080';
const API_BASE_URL = 'http://localhost:8080';
const API_VERSION = 'v1';
const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

const instance = axios.create({
  baseURL: API_URL,
});

/**
 * Adds JWT to the Authorization header
 * @param token JWT token to add to the Authorization header
 */
function addAuthorizationHeader(token: string): void {
  window.localStorage.setItem('token', token);
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * Composable to handle making requests to the backend
 * @returns Functions to make GET and POST requests
 */
function useRequests() {
  /**
   * Send a GET request to the backend
   * @param url URL to make a GET request to
   * @param options Options to pass to the GET request
   * @returns response data from the GET request
   */
  async function get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    const response = await instance.get(url, options);
    return response.data as T;
  }

  /**
   * Send a POST request to the backend
   * @param url URL to make a POST request to
   * @param data Data to send in the POST request
   * @param options Axios config options to pass to the POST request
   * @returns response data from the POST request
   */
  async function post<T extends Record<string, unknown>>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await instance.post(url, data, options);
    return response.data as T;
  }

  /**
   * Send a DELETE request to the backend
   * @param url URL to make a DELETE request to
   * @param options Axios config options to pass to the DELETE request
   */
  async function del(url: string, options?: AxiosRequestConfig): Promise<void> {
    await instance.delete(url, options);
  }

  /**
   * Uploads a file to the backend
   * @param file File to upload
   * @returns Promise that resolves when the file is uploaded
   */
  async function upload(file: File): Promise<void> {
    const store = useAuthenticationStore();
    const { publish } = useEvents();

    if (!store.userID) {
      throw new Error('User ID not found');
    }

    const { connect } = useWebSockets(`${API_URL}/files/upload?token=${store.token}`);
    const socket = await connect();
    /**
     * This will contain the resolve value which will be called in event listerner 'message' when
     * the backend has sent an acknowledgement that the chunk has been received and can send the
     * next one
     */
    let chunkResolve: ((value?: unknown) => void) | null = null;
    let uploadResolve: (value?: void | PromiseLike<void>) => void;
    let uploadReject: (reason?: unknown) => void;

    const uploadPromise: Promise<void> = new Promise((res, rej) => {
      uploadResolve = res;
      uploadReject = rej;
    });

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    socket.addEventListener('error', () => {
      uploadReject(new Error('Socket error'));
    });

    socket.addEventListener('close', (event: CloseEvent) => {
      console.log('Socket closed', event.reason, event.code);
      if (event.code !== 1000) {
        uploadReject(new Error(`Socket closed unexpectedly: ${event.reason}`));
      }

      uploadResolve();
    });

    socket.addEventListener('message', (event: MessageEvent) => {
      const eventData = JSON.parse(event.data);
      publish('file-upload-progress', {
        fileName: file.name,
        uploadPercentage: eventData.uploadPercentage,
      } as Omit<UploadProgressEvent, 'progressBarElemID'>);

      if (chunkResolve) chunkResolve();
    });

    socket.send(
      JSON.stringify({
        totalChunks,
        fileName: file.name,
        userID: store.userID,
      }),
    );

    let chunkNumber = 0;
    for (let i = 1; i <= totalChunks; i++) {
      const start = chunkNumber * CHUNK_SIZE;
      const end = Math.min((chunkNumber + 1) * CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const reader = new FileReader();
      reader.readAsArrayBuffer(chunk);

      reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);

        socket.send(uint8Array);

        chunkNumber++;
      };

      await new Promise((res) => {
        chunkResolve = res;
      });
    }
    return uploadPromise;
  }

  /**
   * Downloads a file from the backend
   * @param fileID ID of the file to download
   * @returns Promise that resolves when the file is downloaded
   */
  async function download(fileID: number): Promise<void> {
    const store = useAuthenticationStore();

    if (!store.userID) {
      throw new Error('User ID not found');
    }

    const { connect } = useWebSockets(`${API_URL}/files/${fileID}?token=${store.token}`);
    const socket = await connect();
    let fileName = '';
    const chunks: BlobPart[] = [];
    return new Promise<void>((resolve, reject) => {
      socket.addEventListener('error', () => {
        reject(new Error('Socket error'));
      });

      socket.addEventListener('close', (event: CloseEvent) => {
        console.log('Socket closed', event.reason, event.code);
        if (event.code !== 1000) {
          reject(new Error(`Socket closed unexpectedly: ${event.reason}`));
        }

        if (event.reason === 'file sent') {
          const blob = new Blob(chunks);

          // Create a download link and download file
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          resolve();
        }
      });

      let firstMessage = true;

      socket.addEventListener('message', (event: MessageEvent) => {
        console.log('Message received', event);

        if (firstMessage && event.data) {
          ({ fileName } = JSON.parse(event.data));

          firstMessage = false;
          return;
        }

        chunks.push(event.data);
      });

      resolve();
    });
  }

  return {
    get,
    post,
    del,
    upload,
    download,
  };
}

export { addAuthorizationHeader, useRequests };
