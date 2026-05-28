<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import type { Bi } from '~/composables/useSocData'

export interface NistSubcategory {
  code: string
  subcategory: Bi
  score: number
  answered: number
  total: number
}

export interface NistFunctionCoverage {
  name: string
  score: number
  answered: number
  subcategories: NistSubcategory[]
}

defineProps<{ coverage: NistFunctionCoverage[] }>()
const { t } = useI18n()

const barColor = (score: number) => {
  if (score >= 4) { return 'bg-emerald-600' }
  if (score >= 3) { return 'bg-brand-300' }
  if (score >= 2) { return 'bg-brand-400' }
  if (score > 0) { return 'bg-brand-200' }
  return 'bg-stone-200'
}
</script>

<template>
  <div class="space-y-3">
    <details
      v-for="fn in coverage"
      :key="fn.name"
      class="card overflow-hidden"
    >
      <summary class="flex cursor-pointer list-none items-center gap-3 p-4 hover:bg-stone-50">
        <span class="w-40 shrink-0 font-semibold text-stone-800">{{ fn.name }}</span>
        <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-stone-100">
          <div
            class="h-full rounded-full transition-all"
            :class="barColor(fn.score)"
            :style="{ width: (fn.score / 5 * 100) + '%' }"
          />
        </div>
        <span class="w-24 shrink-0 text-right text-sm">
          <span class="font-semibold text-stone-700">{{ fn.score.toFixed(1) }}</span>
          <span class="text-stone-500"> / 5</span>
        </span>
      </summary>
      <div class="border-t border-stone-100 bg-stone-50/60 px-4 py-2">
        <div
          v-for="sub in fn.subcategories"
          :key="sub.code"
          class="flex items-center gap-3 border-b border-stone-100 py-2 last:border-0 text-sm"
        >
          <span class="w-24 shrink-0 font-mono text-xs text-stone-500">{{ sub.code }}</span>
          <span
            class="min-w-0 flex-1 truncate text-stone-600"
            :title="t(sub.subcategory)"
          >{{ t(sub.subcategory) }}</span>
          <span
            class="shrink-0 text-xs"
            :class="sub.answered ? 'text-stone-700 font-medium' : 'text-stone-300'"
          >
            {{ sub.answered ? sub.score.toFixed(1) : "未作答" }}
          </span>
        </div>
      </div>
    </details>
  </div>
</template>
