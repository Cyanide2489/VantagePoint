import { computed } from "vue";
import { useSocData } from "~/composables/useSocData";
import { useAssessmentStore } from "~/stores/assessment";

// SOC-CMM maturity levels (0-5) with Taiwan zh-TW descriptions.
export const MATURITY_LEVELS = [
  { min: 0, name: "不存在", desc: "尚未建立相關能力，或處於完全臨機應變的狀態。" },
  { min: 1, name: "初始", desc: "能力剛起步，多為非正式、個人化且不一致的做法。" },
  { min: 2, name: "可重複", desc: "已有基本做法並可重複執行，但尚未完整文件化或標準化。" },
  { min: 3, name: "已定義", desc: "做法已文件化、標準化並普遍落實於組織中。" },
  { min: 4, name: "已管理", desc: "能力受到量測與管理，依指標持續監控成效。" },
  { min: 5, name: "最佳化", desc: "能力持續優化，依數據回饋主動改善並引領最佳實務。" },
];

export function levelFor(score: number) {
  const idx = Math.max(0, Math.min(5, Math.round(score)));
  return MATURITY_LEVELS[idx];
}

export function useScoring() {
  const { domains, nist, allQuestions } = useSocData();
  const store = useAssessmentStore();

  const answeredValues = (codes: string[]) =>
    codes.map((c) => store.answers[c] ?? 0).filter((v) => v >= 1);

  const mean = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  // per-domain maturity score on a 0-5 scale (mean of answered questions).
  const domainScores = computed(() =>
    domains.map((d) => {
      const codes = d.sections.flatMap((s) => s.questions.map((q) => q.code));
      const vals = answeredValues(codes);
      const total = codes.length;
      return {
        letter: d.letter,
        title: d.title,
        score: mean(vals),
        answered: vals.length,
        total,
        sections: d.sections.map((s) => {
          const scodes = s.questions.map((q) => q.code);
          const svals = answeredValues(scodes);
          return { no: s.no, title: s.title, score: mean(svals), answered: svals.length, total: scodes.length };
        }),
      };
    })
  );

  const overallScore = computed(() => {
    const scored = domainScores.value.filter((d) => d.answered > 0);
    return mean(scored.map((d) => d.score));
  });

  // NIST CSF 2.0 coverage: per function, mean maturity of mapped+answered questions.
  const nistCoverage = computed(() => {
    const byFunction: Record<string, { name: string; values: number[]; subs: any[] }> = {};
    for (const entry of Object.values(nist)) {
      const fn = entry.function.zh || entry.function.en;
      const vals = answeredValues(entry.questions);
      const sub = {
        code: entry.code,
        subcategory: entry.subcategory,
        score: mean(vals),
        answered: vals.length,
        total: entry.questions.length,
      };
      if (!byFunction[fn]) byFunction[fn] = { name: fn, values: [], subs: [] };
      byFunction[fn].values.push(...vals);
      byFunction[fn].subs.push(sub);
    }
    return Object.values(byFunction).map((f) => ({
      name: f.name,
      score: mean(f.values),
      answered: f.values.length,
      subcategories: f.subs.sort((a, b) => a.code.localeCompare(b.code)),
    }));
  });

  return { domainScores, overallScore, nistCoverage, allQuestions };
}
