<script setup lang="ts">
import type { Question } from "~/composables/useSocData";
import { useI18n } from "~/composables/useI18n";
import { useAssessmentStore } from "~/stores/assessment";

const props = defineProps<{ question: Question; index: number }>();
const { lang, t, other } = useI18n();
const store = useAssessmentStore();

const LABEL_ZH: Record<string, string> = {
  No: "未具備",
  Partially: "部分具備",
  Averagely: "中等程度",
  Mostly: "大致具備",
  Fully: "完全具備",
};
const label = (en: string) => (lang.value === "zh" ? LABEL_ZH[en] ?? en : en);

const current = computed(() => store.answers[props.question.code] ?? 0);
const select = (v: number) => {
  if (current.value === v) {store.clearAnswer(props.question.code);}
  else {store.setAnswer(props.question.code, v);}
};
</script>

<template>
  <div :id="`q-${question.code}`" class="card p-4 sm:p-5">
    <div class="flex items-start gap-3">
      <span class="mt-0.5 shrink-0 rounded-none bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
        {{ question.code }}
      </span>
      <div class="min-w-0 flex-1">
        <p class="font-medium text-stone-900 leading-snug">{{ t(question.text) }}</p>
        <!-- small item: EN hidden behind disclosure -->
        <details v-if="other(question.text)" class="group mt-1">
          <summary class="cursor-pointer select-none text-xs text-stone-500 hover:text-brand-500 list-none">
            <span class="group-open:hidden">顯示原文</span>
            <span class="hidden group-open:inline">隱藏原文</span>
          </summary>
          <p class="mt-1 text-sm text-stone-500">{{ other(question.text) }}</p>
        </details>
        <div v-if="question.nist?.length" class="mt-2 flex flex-wrap gap-1">
          <span
v-for="n in question.nist" :key="n"
            class="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-500">
            NIST · {{ n }}
          </span>
        </div>
      </div>
    </div>

    <!-- maturity scale: each level shows its scenario description -->
    <ul class="mt-4 space-y-2">
      <li v-for="lvl in question.levels" :key="lvl.value">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-none border p-3 text-left transition"
          :class="current === lvl.value
            ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-300'
            : 'border-stone-200 bg-white hover:border-brand-300 hover:bg-stone-50'"
          @click="select(lvl.value)"
        >
          <span
            class="grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold"
            :class="current === lvl.value ? 'bg-brand-200 text-brand-900' : 'bg-stone-100 text-stone-500'"
          >{{ lvl.value }}</span>
          <span class="min-w-0 flex-1">
            <span
class="block text-sm font-semibold"
              :class="current === lvl.value ? 'text-brand-800' : 'text-stone-700'">
              {{ label(lvl.label) }}
            </span>
            <span class="mt-0.5 block text-sm text-stone-500 leading-snug">{{ t(lvl.scenario) }}</span>
            <span v-if="other(lvl.scenario)" class="mt-0.5 block text-xs text-stone-500 italic leading-snug">
              {{ other(lvl.scenario) }}
            </span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
