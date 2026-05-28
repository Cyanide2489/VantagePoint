<script setup lang="ts">
import { useSocData } from "~/composables/useSocData";
import { useAssessmentStore } from "~/stores/assessment";
import { useDomains } from "~/composables/useDomains";

const { totalQuestions } = useSocData();
const store = useAssessmentStore();
const { domains, icon, progressOf } = useDomains();

const overall = computed(() => (totalQuestions ? store.answeredCount / totalQuestions : 0));
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-stone-900">選擇評估構面</h1>
        <p class="mt-1 text-sm text-stone-500">點選任一構面開始作答，可分次完成、隨時切換。</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <ClearAssessmentButton v-if="store.answeredCount > 0" />
        <NuxtLink v-if="store.answeredCount > 0" to="/results" class="btn-ghost">查看目前結果 →</NuxtLink>
      </div>
    </div>

    <div class="card p-4">
      <ProgressBar :value="overall" :label="`整體進度 · 已完成 ${store.answeredCount} / ${totalQuestions} 題`" />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <NuxtLink
        v-for="(d, i) in domains"
        :key="d.letter"
        :to="`/assessment/${d.letter}`"
        class="card group flex items-center gap-4 p-5 transition hover:border-brand-300 hover:shadow-md"
      >
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-none bg-brand-50 text-2xl">{{ icon(d.letter) }}</span>
        <div class="min-w-0 flex-1">
          <div class="flex items-baseline gap-2">
            <span class="text-xs font-semibold text-brand-500">構面 {{ i + 1 }}</span>
          </div>
          <div class="truncate font-semibold text-stone-900">
            {{ d.title.zh }} <span class="font-normal text-stone-500">{{ d.title.en }}</span>
          </div>
          <div class="mt-1.5 flex items-center gap-2">
            <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
              <div
class="h-full rounded-full bg-brand-500 transition-all"
                :style="{ width: progressOf(d.letter).ratio * 100 + '%' }" />
            </div>
            <span class="shrink-0 text-xs text-stone-500">
              {{ progressOf(d.letter).done }}/{{ progressOf(d.letter).total }}
            </span>
          </div>
        </div>
        <span class="shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-brand-400">→</span>
      </NuxtLink>
    </div>

    <div class="flex justify-between">
      <NuxtLink to="/" class="btn-ghost">← 返回首頁</NuxtLink>
      <div class="flex flex-wrap justify-end gap-2">
        <ClearAssessmentButton v-if="store.answeredCount > 0" />
        <NuxtLink to="/results" class="btn-primary">查看評估結果 →</NuxtLink>
      </div>
    </div>
  </div>
</template>
