<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useEvents } from '@composables/useEvents';
import { useAuthenticationStore } from './stores/authentication.store';
import { RouterView, useRouter } from 'vue-router';

const isAuthChecked = ref<boolean>(false);
const store = useAuthenticationStore();
const { subscribe } = useEvents();
const router = useRouter();

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
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
@use '@styles/utils';
@use '@styles/variables/colors';

// nav {
//   padding: 0.75rem 0.75rem;
//   border-bottom: 0.075rem solid #ccc;

//   h1 {
//     font-weight: 400;
//     font-size: 1.5rem;
//   }
// }

main {
  @include utils.center;

  height: 100vh;
  padding: 0 2rem;
}
</style>
