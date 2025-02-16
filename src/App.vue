<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { Icon } from '@iconify/vue';
import Button from '@/components/Button.vue';
import { useEvents } from '@/composables/useEvents';
import { useAuthenticationStore } from './stores/authentication.store';
import { RouterView, useRouter, useRoute } from 'vue-router';

const isAuthChecked = ref<boolean>(false);
const store = useAuthenticationStore();
const { subscribe } = useEvents();
const router = useRouter();
const route = useRoute();

/**
 * Logout user
 */
function logout() {
  store.logout();
  router.push('/login');
}

onBeforeMount(async () => {
  subscribe<{ userID: number }>('user-login', (data) => {
    if (!data?.userID) {
      throw new Error('No user ID provided in event "user-login"');
    }

    store.userID = data.userID;
    isAuthChecked.value = true;
    router.push('/');
  });
});
</script>

<template>
  <nav class="navbar">
    <h1>Knights Vow</h1>
    <Button
      v-if="route.path !== '/login'"
      class="navbar__logout-btn"
      icon="material-symbols:logout-rounded"
      type="button"
      size="small"
      @click="logout"
    >
      <Icon class="navbar__logout-btn-icon" icon="material-symbols:logout-rounded" />
      Logout
    </Button>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/utils';
@use '@/styles/variables/colors';

.navbar {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;

  h1 {
    flex-grow: 1;
    font-weight: 400;
    font-size: 1.25rem;
  }

  :deep(.navbar__logout-btn) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }

  &__logout-btn-icon {
    height: 1.25rem;
    width: 1.25rem;
  }
}

main {
  @include utils.center;

  height: 100vh;
  padding: 0 2rem;
}
</style>
