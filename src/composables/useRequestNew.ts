import { useAuthenticationStore } from '@/stores/authentication.store';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useEvents } from './useEvents';
import type { UploadProgressEvent } from '@/pages/Home/ProgressDialog.vue';

if (!import.meta.env.VITE_API_BASE_URL || !import.meta.env.VITE_API_VERSION) {
  throw new Error('API base URL or API version not set');
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}`;

const instance = axios.create({
  baseURL: API_URL,
});

/**
 * Adds JWT to the Authorization header
 * @param token JWT token to add to the Authorization header
 */
function addAuthorizationHeader(token: string): void {
  console.log('[addAuthorizationHeader');
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
    console.log('[GET REQUEST] URL: ', url);
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

    await instance.post(`/files?fileName=${file.name}&ownerID=${store.userID}`, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: `Bearer ${store.token}`,
      },
      onUploadProgress(progressEvent) {
        console.log('progressEvent: ', progressEvent);
        publish('file-upload-progress', {
          fileName: file.name,
          uploadPercentage: ((progressEvent.progress || 0) * 100).toFixed(0),
        } satisfies Omit<UploadProgressEvent, 'progressBarElemID'>);
      },
    });
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

    const response = await instance.get(`/files/${fileID}`, {
      responseType: 'blob',
    });

    const [_, fileName] = response.headers['content-disposition']
      ?.split('; filename=')
      .map((x: string) => x.trim()) || ['', ''];

    if (fileName === '') {
      throw new Error('No filename in disposition');
    }

    // Create a download link and download file
    const url = URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
