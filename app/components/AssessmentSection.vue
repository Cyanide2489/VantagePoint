<script setup lang="ts">
import type { Section } from "~/composables/useSocData";
import { useAssessmentStore } from "~/stores/assessment";

const props = defineProps<{
  section: Section;
  index: number;
  expandAllTick: number;
  collapseAllTick: number;
}>();

const store = useAssessmentStore();

const codes = computed(() => props.section.questions.map((q) => q.code));
const answeredValues = computed(() =>
  codes.value.map((c) => store.answers[c] ?? 0).filter((v) => v >= 1)
);
const done = computed(() => answeredValues.value.length);
const total = computed(() => codes.value.length);
const complete = computed(() => total.value > 0 && done.value === total.value);
const avg = computed(() =>
  answeredValues.value.length
    ? answeredValues.value.reduce((a, b) => a + b, 0) / answeredValues.value.length
    : 0
);

// UI-only state (not persisted): collapse once complete, expand while in progress.
const expanded = ref(!complete.value);

watch(complete, (now, before) => {
  if (now && !before) {expanded.value = false;} // auto-collapse on completion
});
watch(() => props.expandAllTick, () => (expanded.value = true));
watch(() => props.collapseAllTick, () => (expanded.value = false));
</script>

<template>
  <section class="space-y-3">
    <!-- header (click to toggle) -->
    <button
      type="button"
      class="flex w-full items-center gap-3 border-l-4 pl-3 pr-2 py-1 text-left transition"
      :class="complete ? 'border-emerald-400' : 'border-brand-400'"
      @click="expanded = !expanded"
    >
      <div class="min-w-0 flex-1">
        <BilingualHeading :value="section.title" level="section" :eyebrow="`項目 ${section.no}`" />
      </div>
      <span
        v-if="complete"
        class="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600"
      >✓ 已完成 · 平均 {{ avg.toFixed(1) }}</span>
      <span
        v-else
        class="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500"
      >{{ done }}/{{ total }}</span>
      <span class="shrink-0 text-stone-500 transition" :class="expanded ? 'rotate-180' : ''">▾</span>
    </button>

    <!-- content -->
    <div v-show="expanded" class="space-y-3">
      <template v-for="(q, qi) in section.questions" :key="q.code">
        <div
          v-if="q.category && (qi === 0 || section.questions[qi - 1].category?.en !== q.category.en)"
          class="pt-1"
        >
          <BilingualHeading :value="q.category" level="category" />
        </div>
        <QuestionCard :question="q" :index="qi" />
      </template>
    </div>
  </section>
</template>
