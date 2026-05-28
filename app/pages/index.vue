<script setup lang="ts">
import { useSocData } from "~/composables/useSocData";
import { useAssessmentStore } from "~/stores/assessment";

const { meta, domains, totalQuestions } = useSocData();
const store = useAssessmentStore();
const progress = computed(() => (totalQuestions ? store.answeredCount / totalQuestions : 0));

const domainIcons: Record<string, string> = { B: "🏢", P: "👥", M: "⚙️", T: "🖥️", S: "🛡️" };
</script>

<template>
  <div class="space-y-8">
    <section class="card overflow-hidden">
      <div class="bg-brand-100 px-6 py-10 text-stone-900 sm:px-10">
        <h1 class="text-3xl font-bold sm:text-4xl">SOC 成熟度自我評估</h1>
        <p class="mt-3 max-w-2xl text-stone-700">
          依據國際 SOC-CMM v2.4.2 框架，協助您快速檢視資安維運中心（SOC）的成熟度。
          每一題都附有各成熟度等級的情境描述，即使非資安專業人員也能輕鬆作答。
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink :to="store.answeredCount > 0 ? '/assessment' : '/onboarding'"
            class="btn bg-white text-brand-800 hover:bg-brand-50">
            {{ store.answeredCount > 0 ? "繼續評估" : "開始評估" }}
          </NuxtLink>
          <NuxtLink v-if="store.answeredCount > 0" to="/results" class="btn border border-brand-300 bg-white/40 text-brand-900 hover:bg-white/70">
            查看結果
          </NuxtLink>
          <ClearAssessmentButton
            v-if="store.answeredCount > 0"
            label="清除答題狀態"
            class="border-brand-300 bg-white/40 text-red-700 hover:bg-white/70"
          />
          <NuxtLink v-else to="/assessment" class="btn border border-brand-300 bg-white/40 text-brand-900 hover:bg-white/70">
            直接前往構面
          </NuxtLink>
        </div>
      </div>
      <div v-if="store.answeredCount > 0" class="px-6 py-4 sm:px-10">
        <ProgressBar :value="progress" :label="`已完成 ${store.answeredCount} / ${totalQuestions} 題`" />
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-lg font-semibold text-stone-800">評估構面（共 {{ meta.questionsCount }} 題）</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="d in domains" :key="d.letter" :to="`/assessment/${d.letter}`"
          class="card flex items-start gap-3 p-4 transition hover:border-brand-300 hover:shadow-md">
          <span class="text-2xl">{{ domainIcons[d.letter] }}</span>
          <div>
            <div class="font-semibold text-stone-900">{{ d.title.zh }}</div>
            <div class="text-xs text-stone-500">{{ d.title.en }}</div>
            <div class="mt-1 text-xs text-stone-500">
              {{ d.sections.length }} 個項目 ·
              {{ d.sections.reduce((n, s) => n + s.questions.length, 0) }} 題
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="card p-5">
      <h2 class="text-lg font-semibold text-stone-800">使用說明</h2>
      <ul class="mt-2 space-y-1.5 text-sm text-stone-600">
        <li>· 每題提供 1–5 級成熟度的情境描述，請選擇最貼近貴組織現況的描述。</li>
        <li>· 大項目（構面／項目）採中英並列；題目與情境以中文為主，可展開原文對照。</li>
        <li>· 作答進度自動儲存在您的瀏覽器，可隨時離開再回來繼續。</li>
        <li>· 完成後可查看各構面成熟度雷達圖與 NIST CSF 2.0 對應覆蓋度，並匯出報告。</li>
      </ul>
    </section>
  </div>
</template>
