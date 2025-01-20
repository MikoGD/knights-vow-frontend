import typescriptEslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue';
import jsDocPlugin from 'eslint-plugin-jsdoc';
import storybookPlugin from 'eslint-plugin-storybook';
import eslintConfigPrettier from 'eslint-config-prettier';
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules', 'dist', 'storybook-static', 'coverage'],
  },
  js.configs.recommended,
  typescriptEslint.configs.recommended,
  ...eslintPluginVue.configs['flat/essential'],
  {
    files: ['**/*.{ts,vue]', '**/*.spec.{ts,js}', '**/*.stories.{ts,js}'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        parser: typescriptEslint.parser,
        project: './tsconfig.app.json',
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
  },
  jsDocPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{ts,vue}', '**/*.test.vue', '**/*.spec.{ts,js}', '**/*.stories.{ts,js}'],
    rules: {
      'jsdoc/no-undefined-types': 'error',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
    },
  },
  ...storybookPlugin.configs['flat/recommended'],
  eslintConfigPrettier,
];
