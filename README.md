# VantagePoint - SOC Maturity Self-Assessment Tool

VantagePoint is a modern, responsive single-page application (SPA) designed to evaluate the operational maturity of a Security Operations Center (SOC). It is built strictly on top of the international SOC-CMM v2.4.2 framework and mapped directly to the NIST Cybersecurity Framework (CSF) 2.0.

This tool is engineered to guide organizations through a highly structured self-assessment questionnaire, rendering real-time radar charts and exporting comprehensive, bilingual reports structured specifically for downstream Large Language Model (LLM) gap analysis and strategic planning.

---

## Technical Stack & Architecture

- **Frontend Core**: HTML5, TypeScript, Vue 3 (Nuxt 3 SPA architecture)
- **Styling**: Tailwind CSS
- **State Management**: Pinia Store with LocalStorage state persistence
- **Data Visualization**: Chart.js / Vue-Chartjs (interactive maturity radar maps)
- **Containerization**: Open Container Initiative (OCI) compliant multi-stage `Containerfile`
- **Testing Suites**: Vitest (Unit Testing) and Playwright (E2E Integration Testing)
- **CI/CD Pipeline**: GitHub Actions with integrated linter, build, Unit/E2E test runners, and Lighthouse CI auditing

---

## Core Operational Features

1. **Structured Bilingual Questionnaire**:
   - Covers 316 assessment questions spanning 5 core domains: Business, People, Process, Technology, and Services.
   - Features Traditional Chinese (`zh-TW`) translations and full English (`en`) side-by-side reference disclosures.
   - Provides concrete, localized scenario descriptions for each of the 1–5 maturity levels.

2. **Interactive Visual Reporting**:
   - Real-time overall maturity scoring (scale of 0.0 to 5.0) and rounding to international maturity thresholds.
   - Interactive SVG/Canvas radar charts analyzing high-level domain scores and granular section-by-section metrics.
   - Fully integrated NIST CSF 2.0 function-level mapping and coverage progress bars.

3. **Bilingual LLM-Optimized Export**:
   - One-click JSON export generating a comprehensive bilingual document.
   - Compiles full assessment details including static levels, selected answers, and question category details.
   - Employs dedicated LLM helper arrays (`lowestScoringDomains`, `lowestScoringSections`, and flat `unansweredQuestions` with structured references) designed for direct context injection.

4. **Offline-First & Privacy Preserving**:
   - Operates entirely client-side.
   - Automatically saves answering state to local storage so users can resume at any time. No server upload or third-party database integrations are utilized.

---

## Getting Started

### System Requirements
- Node.js version 20.x or newer
- npm version 10.x or newer

### Installation
Install the project dependencies locally:
```bash
npm install --legacy-peer-deps
```

### Development
Start the hot-reloading local development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Production Build & Preview
Compile the optimized production assets:
```bash
npm run build
```
Once built, preview the production build locally:
```bash
npm run preview
```

---

## Testing Suite

VantagePoint implements a strict, automated testing regimen.

### Unit Tests
Unit tests are written using **Vitest** to validate mathematical scoring, rounding boundaries, and maturity level clamp conditions:
```bash
npm run test
```

### End-to-End (E2E) Integration Tests
E2E integration tests are written in **Playwright** to simulate user navigation, onboarding steps, data insertion, and questionnaire transitions:
```bash
# Install required Playwright browser binaries
npx playwright install --with-deps chromium

# Execute the E2E integration test suite
npm run test:e2e
```

---

## Container Deployment

For production container deployment, we leverage the multi-stage `Containerfile` located in the project root. This ensures that the final runtime image excludes build tools, reducing the footprint to a minimal Alpine container.

### Build Image
```bash
docker build -t vantagepoint:latest -f Containerfile .
```

### Run Container
```bash
docker run -d \
  -p 3000:3000 \
  --name vantagepoint \
  vantagepoint:latest
```
The application will serve from port `3000` on your host machine.

---

## Continuous Integration Workflow

The project is governed by a GitHub Actions CI pipeline configured in `.github/workflows/ci.yml`.

1. **Build & Lint Verification**: Pulls the code, installs dependencies, and runs `npm run build` to confirm compiling integrity.
2. **Unit Execution**: Runs the Vitest suite (`npm run test`).
3. **E2E Integration Execution**: Sets up Playwright dependencies, builds the production server, and executes the onboarding user flow tests.
4. **Lighthouse CI Auditing**: Spawns the production build and audits `/` and `/onboarding` using standard Google Lighthouse metrics, uploading reports as workflow artifacts.
5. **Automated Changelog Generation**: Upon merging a commit to `main`, a secure shell script automatically extracts git history, writes a clean, chronologically grouped `Changelog.md`, commits it back to the branch, and skips redundant CI cycles.

---

## License & Framework Reference

This application is designed strictly according to the international SOC-CMM maturity methodology and is intended for internal assessment and strategic planning. All intellectual copyrights regarding original questions and domains remain under the respective SOC-CMM framework license specifications.
