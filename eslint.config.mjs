// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // 1. General rules applying to all files
  {
    rules: {
      // JavaScript/ESLint standard strict rules
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-unused-expressions': 'error',
      'no-useless-concat': 'error',

      // General TS/Vue syntax rules (non-type-aware)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'all',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Vue strict rules
      'vue/multi-word-component-names': ['error', {
        ignores: ['index', 'about', 'onboarding', 'results', '[domain]']
      }],
      'vue/require-default-prop': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/html-self-closing': ['error', {
        html: {
          void: 'any',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-unused-vars': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      'vue/valid-v-slot': 'error',
      'vue/block-lang': ['error', {
        script: { lang: 'ts' }
      }]
    }
  },
  // 2. Type-aware rules applying only to TS/Vue files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.mjs',
            'nuxt.config.ts',
            'playwright.config.ts',
            'vitest.config.ts',
            'e2e/assessment.spec.ts'
          ]
        },
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports'
      }],
      '@typescript-eslint/no-dynamic-delete': 'error'
    }
  }
)
