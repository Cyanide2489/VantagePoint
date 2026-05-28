import { useSocData } from '~/composables/useSocData'
import { useAssessmentStore } from '~/stores/assessment'

export const DOMAIN_ICONS: Record<string, string> = {
  B: '🏢',
  P: '👥',
  M: '⚙️',
  T: '🖥️',
  S: '🛡️',
}

export function useDomains() {
  const { domains } = useSocData()
  const store = useAssessmentStore()

  const codesOf = (letter: string) => {
    const d = domains.find(x => x.letter === letter)
    return d ? d.sections.flatMap(s => s.questions.map(q => q.code)) : []
  }

  const progressOf = (letter: string) => {
    const codes = codesOf(letter)
    const done = codes.filter(c => (store.answers[c] ?? 0) >= 1).length
    return { done, total: codes.length, ratio: codes.length ? done / codes.length : 0 }
  }

  const byLetter = (letter: string) => domains.find(d => d.letter === letter) ?? null
  const indexOf = (letter: string) => domains.findIndex(d => d.letter === letter)

  return { domains, icon: (l: string) => DOMAIN_ICONS[l] ?? '📋', progressOf, byLetter, indexOf }
}
