# Changelog

All notable changes to this project will be documented in this file.

## 2026-05-28

### Features Added
- **Bilingual JSON Export**: Extended the results page export functionality to compile a highly structured, bilingual JSON report optimized for LLM planning. Includes overall score level mapping, lowest-scoring domains and sections, and detailed flat reference objects for unanswered questions.
- **Git Initialization**: Initialized a new Git repository and created standard `.gitignore` and `.ignore` exclusions to filter temporary Nuxt and Node outputs.
- **Testing Architecture**: Integrated Vitest and Playwright testing frameworks to establish robust Unit and End-to-End (E2E) testing configurations.
- **Unit and E2E Tests**: Implemented comprehensive unit tests verifying scoring level mapping and Playwright E2E tests validating the landing-to-assessment onboarding workflow.
- **Multi-Stage Containerization**: Built a highly optimized Docker `Containerfile` that reduces runner container size by executing the Nuxt production bundle inside a minimal Node.js Alpine environment.
- **Automated CI/CD Pipeline**: Configured a complete GitHub Actions CI pipeline containing automatic linter checks, Unit tests, E2E tests, Lighthouse CI performance audits, and automated `Changelog.md` generation.

### Documentation
- **Professional Documentation**: Added a comprehensive `README.md` and initial `Changelog.md` adhering strictly to a professional engineering tone.
