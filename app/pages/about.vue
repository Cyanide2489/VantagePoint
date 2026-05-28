<script setup lang="ts">
import { useSocData } from "~/composables/useSocData";
const { meta } = useSocData();
</script>

<template>
  <div class="space-y-6">
    <div class="no-print">
      <NuxtLink to="/" class="btn-ghost">← 返回首頁</NuxtLink>
    </div>

    <section class="card p-6">
      <h1 class="text-2xl font-bold text-stone-900">關於本工具</h1>
      <p class="mt-2 text-stone-600">
        本工具是一個 SOC（資安維運中心）成熟度自我評估平台，依據國際 {{ meta.framework }} 框架製作，
        共涵蓋 {{ meta.questionsCount }} 道評估題目，並對應 NIST CSF 2.0。介面以台灣繁體中文呈現，
        並提供英文原文對照，協助非資安專業人員快速檢視自身 SOC 的成熟度。
      </p>
    </section>

    <CreditsNotice />
  </div>
</template>
