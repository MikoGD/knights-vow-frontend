import { addAuthorizationHeader, useRequests } from '@/composables/useRequests';
import { AxiosError } from 'axios';
import { defineStore } from 'pinia'

interface AuthenticationState {
  userID: number | null;
  isAuthenticated: boolean;
}

export const useAuthenticationStore = defineStore('authentication', {
  state: (): AuthenticationState => {
    return {
      userID: null,
      isAuthenticated: false
    }
  },
  actions: {
    /**
     * Checks local storage for a user ID and token and sets the user ID and token. If not found,
     * user is not authenticated.
     * @returns Authentication status
     */
    async getAuthenicationStatus(): Promise<boolean> {
      const { get } = useRequests()
      const userID = this.userID ?? window.localStorage.getItem('userID')
      const token = window.localStorage.getItem('token')

      if (!userID && !token) {
        return false
      }

      addAuthorizationHeader(token as string)

      let response: { isAuthenticated: boolean }

      try {
        response = await get<{ isAuthenticated: boolean }>(`/users/${userID}/auth-status`)
      } catch (error) {
        error = error as AxiosError
        // TODO: Handle error
        console.error(error)
        return false
      } finally {
      }

      this.isAuthenticated = response.isAuthenticated
      return response.isAuthenticated
    }
  }
})
