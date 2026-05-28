<script setup lang="ts">
import { useSocData } from "~/composables/useSocData";
import { useAssessmentStore } from "~/stores/assessment";
import { useDomains } from "~/composables/useDomains";
import { MATURITY_LEVELS } from "~/composables/useScoring";

const { meta } = useSocData();
const store = useAssessmentStore();
const { domains, icon } = useDomains();
const router = useRouter();

const steps = ["歡迎", "運作方式", "成熟度等級", "開始評估"];
const step = ref(0);
const orgName = ref(store.orgName);

const next = () => {
  if (step.value < steps.length - 1) step.value++;
};
const prev = () => {
  if (step.value > 0) step.value--;
};
const begin = () => {
  store.orgName = orgName.value.trim();
  router.push("/assessment");
};
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <!-- stepper -->
    <ol class="no-print flex items-center gap-2">
      <li v-for="(s, i) in steps" :key="s" class="flex flex-1 items-center gap-2">
        <button
          class="flex items-center gap-2 whitespace-nowrap"
          :class="i <= step ? 'text-brand-700' : 'text-stone-500'"
          @click="i < step && (step = i)"
        >
          <span class="grid h-6 w-6 place-items-center rounded-full text-xs font-bold"
            :class="i <= step ? 'bg-brand-200 text-brand-900' : 'bg-stone-200 text-stone-500'">{{ i + 1 }}</span>
          <span class="hidden text-sm font-medium sm:inline">{{ s }}</span>
        </button>
        <span v-if="i < steps.length - 1" class="h-px flex-1"
          :class="i < step ? 'bg-brand-400' : 'bg-stone-200'" />
      </li>
    </ol>

    <!-- step 0: welcome -->
    <section v-if="step === 0" class="card overflow-hidden">
      <div class="bg-brand-100 px-6 py-10 text-stone-900">
        <h1 class="text-3xl font-bold">歡迎使用 SOC 成熟度自我評估</h1>
        <p class="mt-3 text-stone-700">
          這份問卷將引導您逐步檢視組織資安維運中心（SOC）的成熟度。
          全程使用台灣繁體中文，並附英文原文對照，無需資安背景即可完成。
        </p>
      </div>
      <div class="grid gap-4 p-6 sm:grid-cols-3">
        <div class="text-center">
          <div class="text-2xl font-bold text-brand-600">{{ domains.length }}</div>
          <div class="text-sm text-stone-500">評估構面</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-brand-600">{{ meta.questionsCount }}</div>
          <div class="text-sm text-stone-500">評估題目</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-brand-600">6</div>
          <div class="text-sm text-stone-500">NIST CSF 2.0 功能對應</div>
        </div>
      </div>
    </section>

    <!-- step 1: how it works -->
    <section v-else-if="step === 1" class="card p-6">
      <h2 class="text-xl font-semibold text-stone-900">運作方式</h2>
      <ul class="mt-4 space-y-4">
        <li class="flex gap-3">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-none bg-brand-50 text-brand-600">①</span>
          <div>
            <div class="font-medium text-stone-800">逐構面作答</div>
            <p class="text-sm text-stone-500">{{ domains.length }} 大構面各自獨立，可分次完成、隨時切換，進度會自動儲存於瀏覽器。</p>
          </div>
        </li>
        <li class="flex gap-3">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-none bg-brand-50 text-brand-600">②</span>
          <div>
            <div class="font-medium text-stone-800">依情境描述選擇</div>
            <p class="text-sm text-stone-500">每題提供 1–5 級的情境描述，請選擇最貼近貴組織現況的一項，不需要精確分數。</p>
          </div>
        </li>
        <li class="flex gap-3">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-none bg-brand-50 text-brand-600">③</span>
          <div>
            <div class="font-medium text-stone-800">檢視結果與建議</div>
            <p class="text-sm text-stone-500">完成後可看到各構面成熟度雷達圖、整體等級，以及對應 NIST CSF 2.0 的覆蓋度，並可匯出報告。</p>
          </div>
        </li>
      </ul>
      <div class="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <div v-for="d in domains" :key="d.letter" class="rounded-none border border-stone-200 p-2 text-center">
          <div class="text-xl">{{ icon(d.letter) }}</div>
          <div class="text-xs font-medium text-stone-600">{{ d.title.zh }}</div>
        </div>
      </div>
    </section>

    <!-- step 2: maturity levels -->
    <section v-else-if="step === 2" class="card p-6">
      <h2 class="text-xl font-semibold text-stone-900">認識成熟度等級</h2>
      <p class="mt-1 text-sm text-stone-500">評估以 0–5 級衡量每個面向的成熟度，分數越高代表能力越完整、越制度化。</p>
      <ul class="mt-4 space-y-2">
        <li v-for="lvl in MATURITY_LEVELS" :key="lvl.min" class="flex items-start gap-3 rounded-none border border-stone-200 p-3">
          <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-200 text-sm font-bold text-brand-900">{{ lvl.min }}</span>
          <div>
            <div class="text-sm font-semibold text-stone-800">{{ lvl.name }}</div>
            <p class="text-sm text-stone-500">{{ lvl.desc }}</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- step 3: org info + credits + begin -->
    <section v-else class="space-y-6">
      <div class="card p-6">
        <h2 class="text-xl font-semibold text-stone-900">準備開始</h2>
        <p class="mt-1 text-sm text-stone-500">可選擇填寫組織名稱，將顯示於匯出的報告中（非必填，不會上傳）。</p>
        <label class="mt-4 block">
          <span class="text-sm font-medium text-stone-700">組織名稱 <span class="text-stone-500">（選填）</span></span>
          <input
            v-model="orgName"
            type="text"
            placeholder="例如：○○股份有限公司資安處"
            class="mt-1 w-full rounded-none border border-stone-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
      </div>
      <CreditsNotice />
    </section>

    <!-- nav -->
    <div class="no-print flex items-center justify-between">
      <button v-if="step > 0" class="btn-ghost" @click="prev">← 上一步</button>
      <NuxtLink v-else to="/" class="btn-ghost">← 返回首頁</NuxtLink>

      <button v-if="step < steps.length - 1" class="btn-primary" @click="next">下一步 →</button>
      <button v-else class="btn-primary" @click="begin">開始評估 →</button>
    </div>
  </div>
</template>
