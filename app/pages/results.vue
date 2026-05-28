<script setup lang="ts">
import { useScoring, levelFor } from '~/composables/useScoring'
import { useAssessmentStore } from '~/stores/assessment'
import { useSocData } from '~/composables/useSocData'
import { useAssessmentExport } from '~/composables/useAssessmentExport'

const { domainScores, overallScore, nistCoverage } = useScoring()
const store = useAssessmentStore()
const { totalQuestions } = useSocData()
const { getExportData } = useAssessmentExport()

const overallLevel = computed(() => levelFor(overallScore.value))
const pct = (s: number) => Math.round((s / 5) * 100)

const radarMode = ref<'overview' | 'detailed'>('overview')

const radarLabels = computed(() =>
  radarMode.value === 'overview'
    ? domainScores.value.map(d => d.title.zh)
    : domainScores.value.flatMap(d => d.sections.map(s => s.title.zh)),
)
const radarScores = computed(() =>
  radarMode.value === 'overview'
    ? domainScores.value.map(d => d.score)
    : domainScores.value.flatMap(d => d.sections.map(s => s.score)),
)
const nistRadarLabels = computed(() => nistCoverage.value.map(fn => fn.name))
const nistRadarScores = computed(() => nistCoverage.value.map(fn => fn.score))
const sectionCount = computed(() =>
  domainScores.value.reduce((n, d) => n + d.sections.length, 0),
)

const exportJson = () => {
  const blob = new Blob([JSON.stringify(getExportData(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `soc-cmm-assessment-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
const exportPdf = () => window.print()
</script>

<template>
  <div class="space-y-6">
    <div class="no-print flex flex-wrap items-center justify-between gap-3">
      <NuxtLink
        to="/assessment"
        class="btn-ghost"
      >← 返回作答</NuxtLink>
      <div class="flex flex-wrap justify-end gap-2">
        <ClearAssessmentButton v-if="store.answeredCount > 0" />
        <button
          class="btn-ghost"
          @click="exportJson"
        >
          匯出 JSON
        </button>
        <button
          class="btn-primary"
          @click="exportPdf"
        >
          匯出 / 列印 PDF
        </button>
      </div>
    </div>

    <!-- overall -->
    <section class="card p-6">
      <div class="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
        <div class="grid h-32 w-32 shrink-0 place-items-center rounded-full border-8 border-brand-200 bg-brand-50">
          <div class="text-center">
            <div class="text-3xl font-bold text-brand-800">
              {{ overallScore.toFixed(1) }}
            </div>
            <div class="text-xs text-stone-500">
              / 5.0
            </div>
          </div>
        </div>
        <div>
          <div class="text-sm text-stone-500">
            整體成熟度等級
          </div>
          <div class="text-2xl font-bold text-stone-900">
            L{{ Math.round(overallScore) }} · {{ overallLevel.name }}
          </div>
          <p class="mt-1 max-w-xl text-sm text-stone-600">
            {{ overallLevel.desc }}
          </p>
          <div class="mt-2 text-xs text-stone-500">
            已作答 {{ store.answeredCount }} / {{ totalQuestions }} 題
          </div>
        </div>
      </div>
    </section>

    <!-- radar + domain scores -->
    <div class="space-y-6">
      <section class="card p-5">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 class="font-semibold text-stone-800">
            成熟度雷達圖
          </h2>
          <div class="no-print flex items-center gap-0.5 rounded-none bg-stone-100 p-0.5 text-xs font-medium">
            <button
              class="rounded-none px-2.5 py-1 transition"
              :class="radarMode === 'overview' ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-600'"
              @click="radarMode = 'overview'"
            >
              概覽（構面）
            </button>
            <button
              class="rounded-none px-2.5 py-1 transition"
              :class="radarMode === 'detailed' ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-600'"
              @click="radarMode = 'detailed'"
            >
              詳細（題組）
            </button>
          </div>
        </div>
        <MaturityRadar
          :labels="radarLabels"
          :scores="radarScores"
          :dense="radarMode === 'detailed'"
        />
        <p
          v-if="radarMode === 'detailed'"
          class="mt-2 text-xs text-stone-500"
        >
          依各構面的項目（題組）平均成熟度顯示，共 {{ sectionCount }} 個項目。
        </p>
      </section>

      <section class="card p-5">
        <h2 class="mb-3 font-semibold text-stone-800">
          各構面成熟度
        </h2>
        <div class="space-y-4">
          <div
            v-for="d in domainScores"
            :key="d.letter"
          >
            <div class="flex items-baseline justify-between text-sm">
              <span class="font-medium text-stone-700">{{ d.title.zh }} <span class="text-stone-500">{{ d.title.en }}</span></span>
              <span class="text-stone-500">
                <span class="font-semibold text-stone-700">{{ d.score.toFixed(1) }}</span> / 5
                <span class="ml-1 text-xs text-stone-500">({{ d.answered }}/{{ d.total }})</span>
              </span>
            </div>
            <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                class="h-full rounded-full bg-brand-500"
                :style="{ width: pct(d.score) + '%' }"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- NIST coverage -->
    <section class="card p-5">
      <h2 class="mb-3 font-semibold text-stone-800">
        NIST CSF 2.0 成熟度雷達圖
      </h2>
      <MaturityRadar
        :labels="nistRadarLabels"
        :scores="nistRadarScores"
      />
      <p class="mt-2 text-xs text-stone-500">
        依 NIST CSF 2.0 各功能類別所對應題目的平均成熟度顯示。
      </p>
    </section>

    <section>
      <h2 class="mb-3 font-semibold text-stone-800">
        NIST CSF 2.0 對應覆蓋度
      </h2>
      <p class="mb-3 text-sm text-stone-500">
        依據各 NIST 功能類別所對應題目的平均成熟度估算，點開可檢視子類別。
      </p>
      <NistCoverage :coverage="nistCoverage" />
    </section>
  </div>
</template>
