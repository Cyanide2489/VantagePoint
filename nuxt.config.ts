export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  future: {
    compatibilityVersion: 4,
  },
  srcDir: "app/",
  ssr: false,
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],
  // Only self-host the Latin IBM Plex Sans (small). Traditional-Chinese uses the
  // user's system CJK font (PingFang TC / Microsoft JhengHei / Noto Sans TC) to
  // avoid shipping ~100 render-blocking CJK @font-face subsets.
  css: [
    "@fontsource/ibm-plex-sans/400.css",
    "@fontsource/ibm-plex-sans/500.css",
    "@fontsource/ibm-plex-sans/600.css",
    "@fontsource/ibm-plex-sans/700.css",
    "~/assets/css/main.css",
  ],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || "/",
    head: {
      title: "SOC 成熟度自我評估",
      htmlAttrs: { lang: "zh-Hant" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "SOC-CMM 資安維運中心成熟度自我評估工具" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href:
            "data:image/svg+xml," +
            "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E" +
            "%3Crect width='32' height='32' rx='8' fill='%23a64c2b'/%3E" +
            "%3Ctext x='16' y='22' font-family='sans-serif' font-size='14' font-weight='700' fill='white' text-anchor='middle'%3ESC%3C/text%3E%3C/svg%3E",
        },
      ],
    },
  },
});
