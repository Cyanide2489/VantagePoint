<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { lang, setLang } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="no-print sticky top-0 z-20 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5"
        >
          <span class="grid h-9 w-9 place-items-center rounded-none bg-brand-200 text-brand-900 font-bold">SC</span>
          <div class="leading-tight">
            <div class="text-sm font-semibold text-stone-900">SOC 成熟度自我評估</div>
            <div class="text-xs text-stone-500">SOC-CMM Maturity Self-Assessment</div>
          </div>
        </NuxtLink>
        <div class="flex items-center gap-1 rounded-none bg-stone-100 p-0.5 text-xs font-medium">
          <button
            class="rounded-none px-2.5 py-1 transition"
            :class="lang === 'zh' ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-600'"
            @click="setLang('zh')"
          >
            中文
          </button>
          <button
            class="rounded-none px-2.5 py-1 transition"
            :class="lang === 'en' ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-600'"
            @click="setLang('en')"
          >
            EN
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <NuxtPage />
    </main>

    <footer class="no-print border-t border-stone-200 py-6 text-center text-xs text-stone-600">
      <p>
        評估題目源自 <a
          href="https://www.soc-cmm.com"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-brand-600"
        >SOC-CMM</a>（作者 Rob van Os，CC BY-NC-ND 4.0）·
        對應 <a
          href="https://www.nist.gov/cyberframework"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-brand-600"
        >NIST CSF 2.0</a>
      </p>
      <p class="mt-1">
        資料僅儲存於您的瀏覽器 ·
        <NuxtLink
          to="/about"
          class="underline hover:text-brand-600"
        >著作權與出處聲明</NuxtLink>
      </p>
    </footer>
  </div>
</template>
