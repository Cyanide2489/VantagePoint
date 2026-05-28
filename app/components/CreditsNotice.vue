<script setup lang="ts">
withDefaults(defineProps<{ variant?: "card" | "inline" }>(), { variant: "card" });
</script>

<template>
  <section :class="variant === 'card' ? 'card p-5' : ''">
    <h2 class="flex items-center gap-2 text-base font-semibold text-stone-800">
      <span>著作權與出處聲明</span>
      <span class="text-xs font-normal text-stone-500">Attribution &amp; Credits</span>
    </h2>
    <p class="mt-2 text-sm text-stone-600">
      本工具是基於下列公開框架所製作的非商業性自我評估輔助工具，並非各框架作者所提供、認可或關聯之產品。
      所有評估題目、成熟度模型與對應關係之智慧財產權，均歸屬其原始作者所有。
    </p>

    <dl class="mt-4 space-y-3 text-sm">
      <div class="rounded-none border border-stone-200 bg-stone-50/60 p-3">
        <dt class="font-semibold text-stone-800">SOC-CMM（資安維運中心能力成熟度模型）</dt>
        <dd class="mt-1 text-stone-600">
          作者：Rob van Os。本評估題目、情境描述與成熟度尺規源自 SOC-CMM v2.4.2。
          <br />授權方式：創用 CC「姓名標示—非商業性—禁止改作」4.0 國際（CC BY-NC-ND 4.0）。
          <br />官方網站：<a href="https://www.soc-cmm.com" target="_blank" rel="noopener noreferrer"
            class="text-brand-600 underline hover:text-brand-700">soc-cmm.com</a>
        </dd>
      </div>
      <div class="rounded-none border border-stone-200 bg-stone-50/60 p-3">
        <dt class="font-semibold text-stone-800">NIST Cybersecurity Framework (CSF) 2.0</dt>
        <dd class="mt-1 text-stone-600">
          作者：美國國家標準暨技術研究院（NIST），美國商務部。
          <br />NIST CSF 對應關係參考自 SOC-CMM 提供之 NIST CSF 2.0 對照表。NIST 出版品屬美國政府著作，可自由使用。
          <br />官方網站：<a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener noreferrer"
            class="text-brand-600 underline hover:text-brand-700">nist.gov/cyberframework</a>
        </dd>
      </div>
    </dl>

    <p class="mt-3 text-xs text-stone-500">
      繁體中文翻譯為便利在地使用者所製作之非官方翻譯；若與原文有出入，以英文原文為準。
      本工具不蒐集、不上傳任何作答資料，所有內容僅儲存於您的瀏覽器。
    </p>
  </section>
</template>
