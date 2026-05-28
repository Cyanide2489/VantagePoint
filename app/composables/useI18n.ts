import type { Bi } from "./useSocData";

type Lang = "zh" | "en";

// global UI language for "small items" primary text (questions + scenarios).
// Big items (domain/section/category headings) always show bilingual side-by-side.
const lang = ref<Lang>("zh");

export function useI18n() {
  const setLang = (l: Lang) => (lang.value = l);
  const toggle = () => (lang.value = lang.value === "zh" ? "en" : "zh");

  // primary string for the current language, falling back to the other.
  const t = (bi?: Bi | null): string => {
    if (!bi) {return "";}
    const primary = bi[lang.value];
    return primary && primary.trim() ? primary : bi.en || bi.zh || "";
  };
  // secondary (the other language) for collapsible display.
  const other = (bi?: Bi | null): string => {
    if (!bi) {return "";}
    const sec = lang.value === "zh" ? bi.en : bi.zh;
    return sec && sec.trim() ? sec : "";
  };
  // true when zh translation is genuinely present (not just EN fallback).
  const hasZh = (bi?: Bi | null): boolean =>
    !!bi && !!bi.zh && bi.zh.trim() !== "" && bi.zh !== bi.en;

  return { lang, setLang, toggle, t, other, hasZh };
}
