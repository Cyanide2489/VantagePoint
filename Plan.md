# 匯出完整題目與答案敘述的 JSON 規劃

## Summary

- 擴充目前結果頁的「匯出 JSON」功能，從只輸出 `{ answers: { code: value } }` 改為輸出完整評估報告資料。
- JSON 需包含全部題目；未作答題目保留在檔案中，答案欄位以 `null` 表示。
- 題目、題組、構面、答案 label、答案 scenario 都輸出中英雙語，方便稽核與追溯原始 SOC-CMM 內容。
- 輸出檔案的主要用途是提供給 LLM 進行 SOC 後續改善規劃與差距評估，因此格式必須穩定、機器可讀、避免需要從長篇文字中重新推論結構。

## Key Changes

- 新增一個匯出資料組裝函式，建議放在 `useScoring` 或新的 composable，例如 `useAssessmentExport()`，避免把資料展開邏輯塞在 Pinia store。
- 保留既有 `store.exportJson()` 作為簡易匯出，或改由它呼叫新函式；結果頁 `exportJson()` 按鈕改用新的完整匯出 payload。
- 匯出檔名維持現有格式：`soc-cmm-assessment-YYYY-MM-DD.json`。
- 匯出 JSON 使用穩定、可讀的巢狀結構：`schemaVersion`、`meta`、`summary`、`domains`、`llmPlanningContext`、`answersRaw`。
- 欄位命名使用英文 `camelCase`，欄位值保留中英雙語內容，讓 LLM 與程式都能穩定處理。

## JSON Shape

```json
{
  "schemaVersion": "1.0.0",
  "meta": {
    "framework": "SOC-CMM v2.4.2 (Maturity)",
    "exportedAt": "ISO timestamp",
    "orgName": "",
    "startedAt": "",
    "updatedAt": "",
    "language": "zh/en bilingual",
    "totalQuestions": 316
  },
  "summary": {
    "answeredCount": 0,
    "unansweredCount": 316,
    "completionRatio": 0,
    "overallScore": 0,
    "overallLevel": {
      "value": 0,
      "name": "不存在",
      "description": "尚未建立相關能力，或處於完全臨機應變的狀態。"
    },
    "domainScores": [],
    "nistCoverage": []
  },
  "llmPlanningContext": {
    "purpose": "SOC improvement planning and maturity gap analysis",
    "scoreScale": {
      "min": 0,
      "max": 5,
      "higherIsMoreMature": true
    },
    "recommendedAnalysisTasks": [
      "identify low maturity domains and sections",
      "prioritize improvement actions",
      "map improvements to NIST CSF 2.0 functions",
      "separate quick wins from longer-term initiatives"
    ],
    "lowestScoringDomains": [],
    "lowestScoringSections": [],
    "unansweredQuestions": []
  },
  "domains": [
    {
      "letter": "B",
      "title": { "zh": "業務", "en": "Business" },
      "sections": [
        {
          "no": "1",
          "title": { "zh": "...", "en": "..." },
          "questions": [
            {
              "code": "B 1.1",
              "category": { "zh": "...", "en": "..." },
              "text": { "zh": "...", "en": "..." },
              "importance": 1,
              "nist": ["GV.OC-04"],
              "answered": true,
              "answer": {
                "value": 1,
                "label": { "zh": "未具備", "en": "No" },
                "scenario": { "zh": "...", "en": "..." }
              },
              "allLevels": [
                {
                  "value": 1,
                  "label": { "zh": "未具備", "en": "No" },
                  "scenario": { "zh": "...", "en": "..." }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "answersRaw": {
    "B 1.1": 1
  }
}
```

## Implementation Details

- Build `answer` by matching `store.answers[question.code]` to `question.levels.find((level) => level.value === answerValue)`.
- If no answer exists, set `answered` to `false` and `answer` to `null` while still including `allLevels`.
- Convert English maturity labels to Chinese using the same mapping currently used in `QuestionCard.vue`:
  - `No` -> `未具備`
  - `Partially` -> `部分具備`
  - `Averagely` -> `中等程度`
  - `Mostly` -> `大致具備`
  - `Fully` -> `完全具備`
- Include scoring summaries already available from `useScoring()`:
  - `overallScore`
  - `domainScores`
  - `nistCoverage`
- Add LLM planning helpers that are derived from the same source data:
  - `lowestScoringDomains`: answered domains sorted by score ascending.
  - `lowestScoringSections`: answered sections sorted by score ascending.
  - `unansweredQuestions`: all unanswered question codes with domain/section references.
  - `recommendedAnalysisTasks`: static hints describing how the JSON is intended to be used.
- Keep numeric scores as numbers, not formatted strings; presentation formatting such as `toFixed(1)` should stay in the UI only.
- Avoid embedding Markdown, HTML, or long generated prose in the JSON. The JSON should provide facts and structure for the LLM to reason over.
- Do not alter persisted answer format; local storage remains `Record<string, number>`.

## Test Plan

- With no answers, export includes all 316 questions and every `answer` is `null`.
- With one selected answer, that question includes correct `value`, bilingual `label`, and bilingual selected `scenario`.
- Every exported question includes `text`, `category`, `importance`, `nist`, and `allLevels`.
- Export includes `schemaVersion`, `llmPlanningContext`, `answered`, `unansweredCount`, and `completionRatio`.
- LLM helper arrays are deterministic and sorted consistently by score, then by code/no/title where needed.
- Click `匯出 JSON` from results page and verify the downloaded file opens as valid JSON.
- Confirm filename remains `soc-cmm-assessment-YYYY-MM-DD.json`.
- Existing answering, clearing, scoring, radar charts, and PDF/print behavior remain unchanged.
- `npm.cmd run build` succeeds.

## Assumptions

- JSON should include all questions, including unanswered ones.
- Export text should be bilingual regardless of current UI language.
- JSON is optimized for machine parsing and LLM-assisted SOC improvement planning, not for human-readable report layout.
- `Plan.md` is stored at the project root.
