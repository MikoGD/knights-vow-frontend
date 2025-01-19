import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1',
});

function addAuthorizationHeader(token: string): void {
  window.localStorage.setItem('token', token);
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function useRequests() {
  async function get<T extends Record<string, unknown>>(url: string): Promise<T> {
    const response = await instance.get(url);
    return response.data as T;
  }

  async function post<T extends Record<string, unknown>>(
    url: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    const response = await instance.post(url, data);
    return response.data as T;
  }

  return {
    get,
    post,
  };
}

export { addAuthorizationHeader, useRequests };
