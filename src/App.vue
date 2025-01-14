<script lang="ts" setup>
import { ref } from 'vue';
import Input, { FieldClasses } from '@components/form/Input.vue';
import Authentication from './pages/authentication/sign-up/Authentication.vue';
const userInputValue = ref('');
const passwordInputValue = ref('');

const fieldClasses: Record<string, FieldClasses> = {
  username: {
    field: 'login__form-username',
  },
  password: {
    field: 'login__form-password',
  },
};
</script>

<template>
  <!-- <nav>
    <h1>Knights Vow</h1>
  </nav> -->
  <main>
    <Authentication />
  </main>
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
