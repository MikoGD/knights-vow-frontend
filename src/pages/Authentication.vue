<script lang="ts" setup>
import { AxiosError } from 'axios';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import Input, { FieldClasses } from '@components/form/Input.vue';
import Button from '@components/Button.vue';
import { useRequests, addAuthorizationHeader } from '@composables/useRequests';
import { useEvents } from '@composables/useEvents';

const userInputValue = ref('');
const passwordInputValue = ref('');
const errorMessage = ref<string | undefined>();
const authenticationType = ref<'login' | 'sign-up'>('login');
const isLoading = ref(false);

const { post } = useRequests();
const { publish } = useEvents();

const fieldClasses: Record<string, FieldClasses> = {
  username: {
    field: 'authentication__form-username',
    errorMessage: '',
  },
  password: {
    field: 'authentication__form-password',
    errorMessage: '',
  },
};

function resetErrors() {
  fieldClasses.username.errorMessage = '';
  fieldClasses.password.errorMessage = '';
  errorMessage.value = '';
}

function updateAuthenticationType(type: 'login' | 'sign-up') {
  resetErrors();
  authenticationType.value = type;
}

function getUserIDFromToken(token: string) {
  const decodedToken = jwtDecode(token) as { client_id: string };
  return decodedToken.client_id;
}

async function onFormSubmit(event: Event) {
  event.preventDefault();

  isLoading.value = true;

  try {
    const responseData = await post<{ token: string }>(`/users/${authenticationType.value}`, {
      username: userInputValue.value,
      password: passwordInputValue.value,
    });

    addAuthorizationHeader(responseData.token);
    const userID = getUserIDFromToken(responseData.token);
    window.localStorage.setItem('userID', userID);
    resetErrors();
    publish('user-login', { userID });
  } catch (err) {
    const error = err as AxiosError<{
      message?: string;
      error: Record<string | 'username', string | number>;
    }>;
    if (error.response?.data?.error?.username) {
      fieldClasses.username.errorMessage = error.response.data.error.username as string;
      return;
    }
    errorMessage.value = error?.response?.data.message || 'An error occurred';
  } finally {
    isLoading.value = false;
    return;
  }
}

// Label used for header and submit button
const authenticaitonLabel = computed<string>(() => {
  return authenticationType.value === 'login' ? 'Login' : 'Sign up';
});
</script>
<template>
  <section class="authentication">
    <h2 class="authentication__header">{{ authenticaitonLabel }}</h2>
    <h3 v-if="errorMessage" class="authentication__error-message">
      {{ errorMessage }}
    </h3>
    <form class="authentication__form" @submit="onFormSubmit">
      <Input
        v-model="userInputValue"
        id="username"
        label="Username"
        placeholder="Enter username"
        type="text"
        :classes="fieldClasses.username"
        :disabled="isLoading"
      />
      <Input
        v-model="passwordInputValue"
        id="password"
        label="Password"
        placeholder="Enter password"
        type="password"
        :classes="fieldClasses.password"
        :disabled="isLoading"
      />
      <Button class="authentication__form-submit-btn" type="submit" :is-loading="isLoading">
        {{ authenticaitonLabel }}
      </Button>
      <div
        v-if="authenticationType === 'login'"
        class="authentication__sign-up"
        @click="() => updateAuthenticationType('sign-up')"
      >
        <u>Sign up</u>
      </div>
      <div v-if="authenticationType === 'login'" class="authentication__forgot-password">
        <u>Forgot password?</u>
      </div>
    </form>
  </section>
</template>
<style lang="scss" scoped>
@use '@styles/utils';
@use '@styles/variables/colors';

.authentication {
  @include utils.column;
  align-items: start;
  margin-top: 2.5rem;

  width: 100%;
  height: 100%;

  &__header {
    @include utils.center;

    font-size: 3rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    margin-bottom: 2rem;
  }

  &__error-message {
    font-style: italic;
    font-weight: 300;
    margin-bottom: 2rem;
  }

  &__form {
    width: 100%;

    & .field {
      margin-bottom: 0.8rem;
    }

    &-submit-btn {
      width: 8rem;
      height: 3rem;
      font-size: 1rem;
      color: colors.$text-primary;
      background-color: #bfbfbf;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.3125rem;
      margin-bottom: 1rem;

      &:hover {
        cursor: pointer;
      }
    }
  }

  &__sign-up,
  &__forgot-password {
    margin-top: 0.25rem;
    cursor: pointer;
  }
}
</style>
