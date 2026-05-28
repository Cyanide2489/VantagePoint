import { useSocData, type Bi } from '~/composables/useSocData'
import { useScoring, levelFor } from '~/composables/useScoring'
import { useAssessmentStore } from '~/stores/assessment'

export interface ExportNistSubcategory {
  code: string
  subcategory: Bi
  score: number
  answered: number
  total: number
}

export interface ExportSectionItem {
  domainLetter: string
  no: string
  title: Bi
  score: number
  answeredCount: number
  totalQuestions: number
}

export interface UnansweredQuestionItem {
  code: string
  domain: { letter: string, title: Bi }
  section: { no: string, title: Bi }
  text: Bi
}

export function useAssessmentExport() {
  const { domains, nist, allQuestions } = useSocData()
  const store = useAssessmentStore()
  const { domainScores, overallScore } = useScoring()

  const LABEL_ZH: Record<string, string> = {
    No: '未具備',
    Partially: '部分具備',
    Averagely: '中等程度',
    Mostly: '大致具備',
    Fully: '完全具備',
  }

  const getBilingualLabel = (enLabel: string) => {
    return {
      zh: LABEL_ZH[enLabel] || enLabel,
      en: enLabel,
    }
  }

  const mean = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

  const answeredValues = (codes: string[]) =>
    codes.map(c => store.answers[c] ?? 0).filter(v => v >= 1)

  const getExportData = () => {
    const totalQ = allQuestions.length
    const answeredCount = store.answeredCount
    const unansweredCount = totalQ - answeredCount
    const completionRatio = totalQ ? answeredCount / totalQ : 0

    const currentOverallScore = overallScore.value
    const currentOverallLevel = levelFor(currentOverallScore)

    // 1. Build NIST Coverage (Bilingual)
    const byFunction: Record<string, { zh: string, en: string, values: number[], subs: ExportNistSubcategory[] }> = {}
    for (const entry of Object.values(nist)) {
      const zhFn = entry.function.zh
      const enFn = entry.function.en
      const key = `${zhFn}::${enFn}`
      const vals = answeredValues(entry.questions)
      const sub = {
        code: entry.code,
        subcategory: entry.subcategory, // Bi: { zh, en }
        score: mean(vals),
        answered: vals.length,
        total: entry.questions.length,
      }
      if (!byFunction[key]) {
        byFunction[key] = { zh: zhFn, en: enFn, values: [], subs: [] }
      }
      byFunction[key].values.push(...vals)
      byFunction[key].subs.push(sub)
    }
    const bilingualNistCoverage = Object.values(byFunction).map(f => ({
      name: { zh: f.zh, en: f.en },
      score: mean(f.values),
      answered: f.values.length,
      subcategories: f.subs.sort((a, b) => a.code.localeCompare(b.code)),
    }))

    // 2. Build lowest scoring domains & sections
    // Get domain lists with scores
    const domainItems = domainScores.value.map(d => ({
      letter: d.letter,
      title: d.title,
      score: d.score,
      answeredCount: d.answered,
      totalQuestions: d.total,
    }))
    // lowestScoringDomains: answered domains sorted by score ascending, then letter alphabetically
    const lowestScoringDomains = domainItems
      .filter(d => d.answeredCount > 0)
      .sort((a, b) => a.score - b.score || a.letter.localeCompare(b.letter))

    // Get section lists with scores
    const sectionItems: ExportSectionItem[] = []
    domainScores.value.forEach((d) => {
      d.sections.forEach((s) => {
        sectionItems.push({
          domainLetter: d.letter,
          no: s.no,
          title: s.title,
          score: s.score,
          answeredCount: s.answered,
          totalQuestions: s.total,
        })
      })
    })
    // lowestScoringSections: answered sections sorted by score ascending, then domain letter, then section no
    const lowestScoringSections = sectionItems
      .filter(s => s.answeredCount > 0)
      .sort(
        (a, b) =>
          a.score - b.score
          || a.domainLetter.localeCompare(b.domainLetter)
          || a.no.localeCompare(b.no),
      )

    // 3. Build unansweredQuestions (Detailed Reference Objects)
    const unansweredQuestionsList: UnansweredQuestionItem[] = []
    domains.forEach((d) => {
      d.sections.forEach((s) => {
        s.questions.forEach((q) => {
          const isAnswered = (store.answers[q.code] ?? 0) >= 1
          if (!isAnswered) {
            unansweredQuestionsList.push({
              code: q.code,
              domain: { letter: d.letter, title: d.title },
              section: { no: s.no, title: s.title },
              text: q.text,
            })
          }
        })
      })
    })

    // 4. Build detailed domains tree
    const detailedDomains = domains.map(d => ({
      letter: d.letter,
      title: d.title,
      sections: d.sections.map(s => ({
        no: s.no,
        title: s.title,
        questions: s.questions.map((q) => {
          const answerValue = store.answers[q.code] ?? 0
          const isAnswered = answerValue >= 1
          const matchedLevel = isAnswered
            ? q.levels.find(l => l.value === answerValue)
            : null

          const answer
            = isAnswered && matchedLevel
              ? {
                  value: answerValue,
                  label: getBilingualLabel(matchedLevel.label),
                  scenario: matchedLevel.scenario,
                }
              : null

          const allLevels = q.levels.map(l => ({
            value: l.value,
            label: getBilingualLabel(l.label),
            scenario: l.scenario,
          }))

          return {
            code: q.code,
            category: q.category, // Bi | null
            text: q.text,
            importance: q.importance,
            nist: q.nist || [],
            answered: isAnswered,
            answer: answer,
            allLevels: allLevels,
          }
        }),
      })),
    }))

    return {
      schemaVersion: '1.0.0',
      meta: {
        framework: 'SOC-CMM v2.4.2 (Maturity)',
        exportedAt: new Date().toISOString(),
        orgName: store.orgName || '',
        startedAt: store.startedAt || '',
        updatedAt: store.updatedAt || '',
        language: 'zh/en bilingual',
        totalQuestions: totalQ,
      },
      summary: {
        answeredCount,
        unansweredCount,
        completionRatio,
        overallScore: currentOverallScore,
        overallLevel: {
          value: Math.round(currentOverallScore),
          name: currentOverallLevel.name,
          description: currentOverallLevel.desc,
        },
        domainScores: domainItems,
        nistCoverage: bilingualNistCoverage,
      },
      llmPlanningContext: {
        purpose: 'SOC improvement planning and maturity gap analysis',
        scoreScale: {
          min: 0,
          max: 5,
          higherIsMoreMature: true,
        },
        recommendedAnalysisTasks: [
          'identify low maturity domains and sections',
          'prioritize improvement actions',
          'map improvements to NIST CSF 2.0 functions',
          'separate quick wins from longer-term initiatives',
        ],
        lowestScoringDomains,
        lowestScoringSections,
        unansweredQuestions: unansweredQuestionsList,
      },
      domains: detailedDomains,
      answersRaw: { ...store.answers },
    }
  }

  return {
    getExportData,
  }
}
