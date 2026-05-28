import { defineStore } from "pinia";
import { useSocData } from "~/composables/useSocData";

export const useAssessmentStore = defineStore("assessment", {
  state: () => ({
    // question code -> maturity value (1..5). absent / 0 means unanswered.
    answers: {} as Record<string, number>,
    orgName: "",
    startedAt: "" as string,
    updatedAt: "" as string,
  }),

  getters: {
    answeredCount: (s) => Object.values(s.answers).filter((v) => v >= 1).length,
    isAnswered: (s) => (code: string) => (s.answers[code] ?? 0) >= 1,
  },

  actions: {
    setAnswer(code: string, value: number) {
      if (!this.startedAt) this.startedAt = new Date().toISOString();
      this.answers[code] = value;
      this.updatedAt = new Date().toISOString();
    },
    clearAnswer(code: string) {
      delete this.answers[code];
      this.updatedAt = new Date().toISOString();
    },
    reset() {
      this.answers = {};
      this.orgName = "";
      this.startedAt = "";
      this.updatedAt = "";
    },
    progress() {
      const { totalQuestions } = useSocData();
      return totalQuestions ? this.answeredCount / totalQuestions : 0;
    },
    importJson(payload: any) {
      if (payload && typeof payload.answers === "object") {
        this.answers = { ...payload.answers };
        this.orgName = payload.orgName ?? "";
        this.startedAt = payload.startedAt ?? new Date().toISOString();
        this.updatedAt = new Date().toISOString();
      }
    },
    exportJson() {
      return {
        framework: "SOC-CMM v2.4.2 (Maturity)",
        orgName: this.orgName,
        startedAt: this.startedAt,
        updatedAt: this.updatedAt,
        answers: this.answers,
      };
    },
  },

  persist: true,
});
