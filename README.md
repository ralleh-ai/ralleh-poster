# Ralleh Poster

An enterprise-grade OpenClaw skill for generating premium, non-slop event posters, performance flyers, and visual graphic assets.

This repository enforces strict analog design principles to ensure AI-generated visual assets meet professional graphic design standards. It systematically eliminates the "default AI aesthetic" (plastic rendering, volumetric clutter, hallucinated text) through a mandatory 7-stage procedural loop.

---

## 🏗️ Repository Architecture

This repository is optimized for two outcomes:
1. LLM context training for high-quality poster generation
2. OpenClaw-native skill execution

### Authority chain (required read order)
1. **`CORE_RULES.md`** — Non-negotiable behavior rules and output contract
2. **`WORKFLOW.md`** — Mandatory 7-stage execution loop
3. **`STANDARDS.md`** — Binding design standards and anti-slop constraints
4. **`TEMPLATES.md`** — Reusable style templates and prompt scaffolds
5. **`examples/`** — Few-shot success/failure calibration

### LLM bootstrap assets
- `LLM_INSTRUCTIONS.md` — canonical system prompt and runtime behavior
- `llm-reference.md` — compact reference for short context windows
- `FULL_LLM_REFERENCE.md` — single-file expanded context
- `LLM_BOOTSTRAP.md` — conversational startup behavior

### OpenClaw integration docs
- `SKILL.md` — OpenClaw skill entrypoint
- `TOOLS.md` — tool contract, fallbacks, output architecture
- `docs/installation.md` — current install and config guidance

---

## ✅ Validation & CI

Run local validation:

```bash
npm run validate
```

CI enforcement:
- GitHub Actions workflow at `.github/workflows/validate.yml`
- Runs on push to `main` and on pull requests
- Fails the build when schema/content checks fail

Phase 4–7 semantic enforcement now validates:
- minimum standards reference coverage across examples
- anti-slop keyword density in prompt blocks
- critique-table depth per example
- metadata consistency between Example Type and Outcome
- explicit typography method declaration (Method A or Method B)
- weighted per-example quality scoring (0–100)
- per-example-type thresholds (Positive/Negative)
- stage-level quality budget thresholds (default + stage-specific budgets)
- overall corpus score threshold
- machine-readable report artifact at `reports/validation-report.json`
- actionable remediation suggestions per issue/file
- score trend tracking in `reports/validation-trends.json`

View local reports:

```bash
npm run validate:report
npm run validate:trends
npm run validate:publish
```

Phase 9–14 reporting + expansion artifacts:
- `reports/validation-summary.md` (human-friendly markdown summary)
- `reports/quality-badges.json` (badge metadata for automation)
- `reports/validation-trends.json` includes commit-range diff metadata and regression hints
- `reports/validation-report.json` includes:
  - `improvementPlan` with expected-impact prioritized next steps
  - `stageExpansionPlan` with missing-stage targets and template-ready stubs
- `scripts/materialize-stage-stubs.js` auto-materializes stage coverage drafts into `examples/drafts/`
  - guardrail: drafts are not scored until promoted to canonical `example-XX-*` names
- `scripts/promote-stage-stub.js` safely promotes a draft stub into scored corpus:
  - auto-select by stage or draft file
  - auto-number canonical example filename
  - auto-update examples index
  - preflight validation + rollback on failure
  - regression guardrail blocks score/warning regressions by default (`--allow-regression` override)
- CI appends summary to GitHub job summary and uploads all report artifacts

## ⚙️ Installation & Usage

### OpenClaw Gateway Integration
This repository functions natively as a dynamically loaded OpenClaw skill. For detailed instructions on adding it to your OpenClaw JSON config, setting up agent profiles, and invoking it (Direct User vs Sub-Agent delegation), read the guide:
👉 **[OpenClaw Installation Guide (`docs/installation.md`)](docs/installation.md)**

### End-to-End Example Runs
To understand the exact outputs expected from each of the 7 stages in `WORKFLOW.md`, review the complete session logs:
👉 **[Example 03: End-to-End Run (`examples/example-03-end-to-end.md`)](examples/example-03-end-to-end.md)**

---

## 🤖 Instructions for Web AI & LLMs

If you are an LLM (ChatGPT, Claude, etc.) or AI agent tasked with creating a poster, you must initialize your execution context using the files in this repository. 

**DO NOT begin image generation immediately.**

### Bootstrap Sequence

For LLM execution, start with:

1. `LLM_INSTRUCTIONS.md`
2. `CORE_RULES.md`
3. `WORKFLOW.md`
4. `STANDARDS.md`
5. `TEMPLATES.md`
6. `examples/README.md` + at least one success and one failure example

Use `llm-reference.md` when context budget is tight.
Use `FULL_LLM_REFERENCE.md` when you can load more context.

### Starter Prompt for Users

*(Users: Copy and paste this prompt into your AI chat to initialize the skill if you are pointing the AI to this repo)*

```markdown
You are an expert poster designer operating under the Ralleh Poster skill. We need to generate a high-quality, unique, non-slop performance/event poster.

To begin:
1. Read `LLM_INSTRUCTIONS.md` in this repository.
2. Read authority files in order: `CORE_RULES.md`, `WORKFLOW.md`, `STANDARDS.md`, `TEMPLATES.md`.
3. Read `examples/README.md` and one success + one failure example.
4. Then begin Stage 1 intake.
```

---

## 🚫 The Anti-Slop Guarantee

This skill is designed to prevent generic diffusion-model outputs. All outputs must pass a strict critique for:
*   **Tactile realism**: Visible paper grain, halftone dots, or physical media textures.
*   **Restricted palettes**: Maximum 4 named colors.
*   **Negative space**: At least 30% of the canvas at rest.
*   **Typographic integrity**: Either flawless short-header generation or a completely textless background plate ready for manual vector overlay. 

*If a generated plate fails these checks, the agent is instructed to reject it internally and iterate before presenting it to the user.*
