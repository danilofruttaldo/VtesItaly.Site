import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import astroPlugin from 'eslint-plugin-astro';
import * as astroParser from 'astro-eslint-parser';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/pagefind/'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/triple-slash-reference': 'off',
      // The TypeScript compiler (astro check) already reports undefined names,
      // with the right globals for each file: browser ones in src/scripts,
      // Node ones in src/utils. typescript-eslint recommends turning it off.
      'no-undef': 'off',
    },
  },
  {
    // The early language redirect: a classic script inlined in the page head.
    files: ['src/scripts/**/*.js'],
    languageOptions: {
      globals: { document: 'readonly', localStorage: 'readonly', location: 'readonly' },
    },
  },
  {
    // The service worker: a classic script run in the worker scope, not the page.
    files: ['public/sw.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Response: 'readonly',
      },
    },
  },
  ...astroPlugin.configs.recommended,
  // jsx-a11y rules on the templates, through eslint-plugin-jsx-a11y-x: the
  // original eslint-plugin-jsx-a11y does not accept ESLint 10 as a peer.
  ...astroPlugin.configs['jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: { parser: tsParser },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-redeclare': 'off',
      'no-empty': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_|^e$' }],
      // A table wrapper that scrolls sideways is a focusable, labelled region
      // (tabindex="0" role="region"), as axe's scrollable-region-focusable
      // asks: keyboard users can scroll it.
      'astro/jsx-a11y/no-noninteractive-tabindex': ['error', { tags: [], roles: ['tabpanel', 'region'] }],
      // role="list" on the nav <ul>s is on purpose: Safari/VoiceOver drops the
      // list semantics of a list with `list-style: none`.
      'astro/jsx-a11y/no-redundant-roles': ['error', { ul: ['list'] }],
    },
  },
  {
    files: ['**/*.mjs', 'scripts/**'],
    languageOptions: {
      globals: {
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Buffer: 'readonly',
        fetch: 'readonly',
        AbortSignal: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },
  {
    // Vitest test files run in Node and may use timers, process, console, etc.
    files: ['tests/**/*.ts', 'vitest*.config.ts'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },
];
