<script setup lang="ts">
import type { Bi } from '~/composables/useSocData'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  value: Bi
  level?: 'domain' | 'section' | 'category'
  eyebrow?: string
}>()

const { t, other } = useI18n()
const size = computed(() => {
  if (props.level === 'domain') { return 'text-2xl sm:text-3xl font-bold' }
  if (props.level === 'section') { return 'text-xl font-semibold' }
  return 'text-base font-semibold'
})
</script>

<template>
  <div>
    <div
      v-if="eyebrow"
      class="text-xs font-semibold uppercase tracking-wide text-brand-500"
    >
      {{ eyebrow }}
    </div>
    <h2
      :class="size"
      class="text-stone-900 leading-tight"
    >
      {{ t(value) }}
      <span
        v-if="other(value)"
        class="ml-1.5 align-baseline text-stone-500 font-normal"
        :class="level === 'domain' ? 'text-lg' : level === 'section' ? 'text-base' : 'text-sm'"
      >
        {{ other(value) }}
      </span>
    </h2>
  </div>
</template>
