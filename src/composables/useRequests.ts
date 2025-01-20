import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1',
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
   * @returns response data from the GET request
   */
  async function get<T>(url: string): Promise<T> {
    const response = await instance.get(url);
    return response.data as T;
  }

  /**
   * Send a POST request to the backend
   * @param url URL to make a POST request to
   * @param data Data to send in the POST request
   * @returns response data from the POST request
   */
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
