import socData from '~/data/soc-cmm.json'

export interface Bi {
  en: string
  zh: string
}
export interface Level {
  value: number
  label: string
  scenario: Bi
}
export interface Question {
  code: string
  text: Bi
  category: Bi | null
  importance: number
  nist: string[]
  levels: Level[]
}
export interface Section {
  no: string
  title: Bi
  questions: Question[]
}
export interface Domain {
  letter: string
  title: Bi
  sections: Section[]
}
export interface NistEntry {
  code: string
  function: Bi
  category: Bi
  subcategory: Bi
  questions: string[]
}
export interface SocData {
  meta: { framework: string, scale: Record<string, string>, domainsCount: number, questionsCount: number }
  domains: Domain[]
  nist: Record<string, NistEntry>
}

const data = socData as unknown as SocData

export function useSocData() {
  const allQuestions = data.domains.flatMap(d =>
    d.sections.flatMap(s => s.questions.map(q => ({ ...q, domain: d.letter }))),
  )
  return {
    data,
    domains: data.domains,
    nist: data.nist,
    meta: data.meta,
    totalQuestions: allQuestions.length,
    allQuestions,
  }
}
