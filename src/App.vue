<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import PageLoader from '@components/loader/PageLoader.vue';
import Authentication from './pages/authentication/sign-up/Authentication.vue';
import { useEvents } from '@composables/useEvents';
import { useAuthenticationStore } from './stores/authentication.store';

const isAuthChecked = ref<boolean>(false);
const store = useAuthenticationStore();
const { subscribe } = useEvents();

onBeforeMount(async () => {
  subscribe<{ userID: number }>('user-login', (data) => {
    if (!data?.userID) {
      throw new Error('No user ID provided in event "user-login"');
    }

    store.isAuthenticated = true;
    store.userID = data.userID;
    isAuthChecked.value = true;
  });

  await store.getAuthenicationStatus();
  isAuthChecked.value = true;
});
</script>

<template>
  <!-- <nav>
    <h1>Knights Vow</h1>
  </nav> -->
  <main>
    <Authentication v-if="isAuthChecked && !store.isAuthenticated" />
    <h1 v-if="store.isAuthenticated">Logged in</h1>
  </main>
  <PageLoader :show="!isAuthChecked" />
</template>

<style lang="scss" scoped>
@use '@styles/utils';
@use '@styles/variables/colors';

nav {
  padding: 0.75rem 0.75rem;
  border-bottom: 0.075rem solid #ccc;

  h1 {
    font-weight: 400;
    font-size: 1.5rem;
  }
}

main {
  @include utils.center;

  height: 100vh;
  padding: 2.5rem 2rem 0 2rem;
}
</style>
