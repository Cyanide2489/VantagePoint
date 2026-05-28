<script setup lang="ts">
import { useAssessmentStore } from '~/stores/assessment'
import { useSocData } from '~/composables/useSocData'
import { useDomains } from '~/composables/useDomains'

const route = useRoute()
const router = useRouter()
const store = useAssessmentStore()
const { totalQuestions } = useSocData()
const { domains, icon, progressOf, byLetter, indexOf } = useDomains()

const letter = computed(() => String(route.params.domain || ''))
const domain = computed(() => byLetter(letter.value))
const idx = computed(() => indexOf(letter.value))

// redirect unknown domain codes back to the overview
watchEffect(() => {
  if (letter.value && !domain.value) { router.replace('/assessment') }
})

const prev = computed(() => (idx.value > 0 ? domains[idx.value - 1] : null))
const next = computed(() => (idx.value < domains.length - 1 ? domains[idx.value + 1] : null))

const go = (to: string) => {
  router.push(to)
  if (import.meta.client) { window.scrollTo({ top: 0, behavior: 'smooth' }) }
}

const dp = computed(() => progressOf(letter.value))

// signals to drive expand/collapse across all sections of the current domain
const expandAllTick = ref(0)
const collapseAllTick = ref(0)
</script>

<template>
  <div
    v-if="domain"
    class="space-y-5"
  >
    <!-- breadcrumb + overall progress -->
    <div class="no-print flex flex-wrap items-center justify-between gap-3 text-sm">
      <nav class="flex items-center gap-1.5 text-stone-500">
        <NuxtLink
          to="/assessment"
          class="hover:text-brand-600"
        >評估構面</NuxtLink>
        <span>/</span>
        <span class="font-medium text-stone-700">{{ domain.title.zh }}</span>
      </nav>
      <span class="text-xs text-stone-500">整體 {{ store.answeredCount }} / {{ totalQuestions }} 題</span>
    </div>

    <!-- quick domain switcher -->
    <div class="no-print flex gap-2 overflow-x-auto pb-1">
      <NuxtLink
        v-for="d in domains"
        :key="d.letter"
        :to="`/assessment/${d.letter}`"
        class="flex shrink-0 items-center gap-2 rounded-none border px-3 py-2 text-sm transition"
        :class="d.letter === letter
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'"
      >
        <span>{{ icon(d.letter) }}</span>
        <span class="font-medium">{{ d.title.zh }}</span>
        <span class="rounded-full bg-white/70 px-1.5 text-xs text-stone-500">
          {{ progressOf(d.letter).done }}/{{ progressOf(d.letter).total }}
        </span>
      </NuxtLink>
    </div>

    <!-- domain header + per-domain progress -->
    <div class="space-y-3">
      <BilingualHeading
        :value="domain.title"
        level="domain"
        :eyebrow="`構面 ${idx + 1} / ${domains.length}`"
      />
      <ProgressBar
        :value="dp.ratio"
        :label="`本構面進度 · ${dp.done} / ${dp.total} 題`"
      />
      <div class="no-print flex justify-end gap-2 text-xs">
        <button
          class="rounded-none border border-stone-200 px-2.5 py-1 text-stone-500 hover:bg-stone-50"
          @click="expandAllTick++"
        >
          全部展開
        </button>
        <button
          class="rounded-none border border-stone-200 px-2.5 py-1 text-stone-500 hover:bg-stone-50"
          @click="collapseAllTick++"
        >
          全部收合
        </button>
      </div>
    </div>

    <!-- questions, grouped by collapsible section (題組) -->
    <AssessmentSection
      v-for="(sec, si) in domain.sections"
      :key="sec.no"
      :section="sec"
      :index="si"
      :expand-all-tick="expandAllTick"
      :collapse-all-tick="collapseAllTick"
    />

    <!-- navigation -->
    <div class="no-print flex items-center justify-between gap-2 pt-2">
      <button
        v-if="prev"
        class="btn-ghost"
        @click="go(`/assessment/${prev.letter}`)"
      >
        ← {{ prev.title.zh }}
      </button>
      <NuxtLink
        v-else
        to="/assessment"
        class="btn-ghost"
      >← 構面總覽</NuxtLink>

      <button
        v-if="next"
        class="btn-primary"
        @click="go(`/assessment/${next.letter}`)"
      >
        {{ next.title.zh }} →
      </button>
      <NuxtLink
        v-else
        to="/results"
        class="btn-primary"
      >查看評估結果 →</NuxtLink>
    </div>
  </div>
</template>
