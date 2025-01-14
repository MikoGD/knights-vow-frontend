import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src'
      },
      {
        find: '@styles',
        replacement: '/src/styles'
      },
      {
        find: '@components',
        replacement: '/src/components'
      },
      {
        find: '@composables',
        replacement: '/src/composables',
      }
    ]
  }
})
