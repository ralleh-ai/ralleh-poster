# Changelog

## 3.0.0 - 2026-07-17
**Breaking: single-entrypoint refactor (Carmack pass).**
- Removed 5 redundant files: `CORE_RULES.md`, `LLM_INSTRUCTIONS.md`, `LLM_BOOTSTRAP.md`, `FULL_LLM_REFERENCE.md`, `llm-reference.md`. Every one duplicated the authority chain and hard-constraint list already owned by `SKILL.md` and `STANDARDS.md`.
- `SKILL.md` is now the sole LLM/OpenClaw entrypoint. It owns: operational contract, canonical non-negotiables (with `STANDARDS.md` refs, no duplicated rule text), per-stage output contract, failure contract, tool contract, Web-UI bootstrap block, success criteria.
- `STANDARDS.md` remains the single source of truth for design law. Non-negotiables in `SKILL.md` reference it by section instead of restating it.
- Updated `README.md` authority chain and starter prompt.
- Updated `docs/installation.md` to point web LLMs at `SKILL.md`.
- Validator (`scripts/validate-content.js`): removed deleted files from `requiredFiles`, updated `requiredAuthorityFiles` to `[WORKFLOW, STANDARDS, TEMPLATES, TOOLS]`, dropped assertions for deleted files.
- Net: -5 files, ~-230 lines of duplication, one path to the law, zero contradictions possible.

## 2.16.0 - 2026-07-17
- Phase 16 stage-coverage lock policy enforcement completed.
- Added strict stage coverage lock in validator policy (`stageCoverageLock`) requiring Stage 1..7 representation.
- Validator now fails with a high-priority error if any stage checkpoint is missing from canonical examples.
- Extended report policy payload to include `stageCoverageLock` config for traceable CI governance.

## 2.15.0 - 2026-07-17
- Phase 15 stage-7 completion and full stage coverage closure.
- Hardened Stage 7 draft quality for guarded promotion (added standards density + deeper critique mapping).
- Promoted Stage 7 stub to `examples/example-09-success-release-readiness-gate.md` via guarded promotion workflow.
- Validation now reports no missing stages (`summary.missingStages: []`).
- Corpus maintains clean gate after promotion: score 97, warnings 0, errors 0.

## 2.14.0 - 2026-07-17
- Phase 14 draft promotion workflow completed.
- Added `scripts/promote-stage-stub.js` for safe promotion of draft stage stubs into scored examples.
- Added npm script `stage-stubs:promote`.
- Promotion features:
  - selector by `--stage` or `--draft`
  - canonical filename auto-numbering (`example-XX-<success|failure>-<theme>.md`)
  - `examples/README.md` index auto-update
  - preflight validation gate with rollback on failure
  - draft cleanup + draft manifest update on success
  - guardrail blocks score/warning regressions unless `--allow-regression` is provided
- Added `--dry-run` support for no-write promotion preview.

## 2.13.0 - 2026-07-17
- Phase 13 draft stub materialization completed.
- Added `scripts/materialize-stage-stubs.js` to auto-create missing-stage draft files from `stageExpansionPlan`.
- Added npm script `stage-stubs:materialize` (runs validation then generates draft stubs).
- Draft stubs are written to `examples/drafts/` with guardrails:
  - draft filename pattern intentionally excluded from strict scoring regex
  - clear preamble explains promotion path to canonical `example-XX-*` files
- Added draft manifest output: `examples/drafts/_manifest.json`.

## 2.12.0 - 2026-07-17
- Phase 12 stage-coverage expansion planning completed.
- `validation-report.json` now includes `stageExpansionPlan` with:
  - missing stage checkpoints
  - priority/rationale per target
  - suggested example path and type
  - template-ready markdown stub for each target stage
- `summary.missingStages` added for quick coverage visibility.
- `publish-validation-summary` now includes a "Stage Coverage Expansion Targets" section.
- Validator CLI output now surfaces top stage expansion target.

## 2.11.0 - 2026-07-17
- Phase 11 stage-targeted next-best-improvement prioritization completed.
- `validation-report.json` now includes `improvementPlan` ranked by expected score impact.
- Added per-example expected-impact modeling based on stage budgets, type thresholds, and metric gaps.
- `publish-validation-summary` now renders a "Next-Best Improvements" section with actionable ranked steps.
- Validator CLI output now surfaces top next-best improvement candidate.

## 2.10.0 - 2026-07-17
- Phase 10 commit-range diffing and regression hinting completed.
- `validate-content` now computes trend delta against previous distinct commit head (not same-commit reruns).
- `validation-trends.json` now stores:
  - per-run commit range diff metadata
  - changed file counts
  - regression hint entries with likely culprit files
- `publish-validation-summary` now includes:
  - changed-files metric since previous distinct commit
  - regression culprit hint section (when regressions occur)
  - trend rows with per-run delta display.

## 2.9.0 - 2026-07-17
- Phase 9 CI summary/badge publishing completed.
- Added `scripts/publish-validation-summary.js` to generate:
  - `reports/validation-summary.md`
  - `reports/quality-badges.json`
- Added npm scripts:
  - `validate:publish`
  - `validate:all`
- Updated CI workflow to:
  - run validation + summary publishing
  - append summary markdown to GitHub job summary
  - upload expanded report artifacts

## 2.8.0 - 2026-07-17
- Phase 8 stage-distribution balancing and warning reduction completed.
- Rebalanced stage checkpoint distribution across examples (now includes Stage 3/4/5/6 representation).
- Strengthened anti-slop prompt constraints and critique mappings in examples to clear stage/type warning budgets.
- Improved negative typography failure case with stronger standards coverage and recovery critique detail.
- Validation quality improved to zero warnings with higher corpus score.

## 2.7.0 - 2026-07-17
- Phase 7 threshold/budget enforcement completed.
- Added per-example-type quality thresholds (Positive and Negative) with warn/fail enforcement.
- Added stage-level quality budget enforcement based on `Primary Stage Checkpoint` metadata.
- Added stage parsing/validation (Stage 1..7 format) and stage diversity signal in summary.
- Extended report payload with `policies` and per-example threshold context.

## 2.6.0 - 2026-07-17
- Phase 6 remediation + trend tracking completed.
- Added actionable remediation guidance in validation report (`remediation[]` with file/issue/action/priority).
- Added score trend tracking output at `reports/validation-trends.json` with bounded history.
- Added trend delta in validation summary and warning on score regression.
- Updated CI to upload both report artifacts (`validation-report.json`, `validation-trends.json`).
- Added `npm run validate:trends` helper script.

## 2.5.0 - 2026-07-17
- Phase 5 quality scoring and reporting completed.
- Upgraded validator to weighted quality scoring:
  - per-example score (0–100)
  - overall corpus score threshold
  - warn/fail tier outputs
- Added machine-readable report output at `reports/validation-report.json`.
- Updated GitHub Actions workflow to upload validation report artifact.
- Added `npm run validate:report` for local inspection.

## 2.4.0 - 2026-07-17
- Phase 4 semantic quality enforcement completed.
- Expanded `scripts/validate-content.js` with semantic gates:
  - minimum standards reference count per example
  - corpus-wide distinct standards coverage threshold
  - anti-slop keyword density checks in prompt blocks
  - critique mapping depth requirement
  - metadata consistency checks (Outcome vs Example Type)
  - explicit Method A/Method B declaration requirement
- Updated README validation section to document Phase 4 semantic checks.

## 2.3.0 - 2026-07-17
- Phase 3 CI + enforcement completed.
- Added GitHub Actions validation workflow: `.github/workflows/validate.yml`.
- Expanded `scripts/validate-content.js` with stricter checks:
  - required files + authority consistency
  - SKILL frontmatter sanity
  - legacy model naming rejection
  - local markdown link validation
  - mandatory example schema checks
- Standardized remaining examples (`example-01`, `example-02`, `example-05`) to required few-shot schema.

## 2.2.0 - 2026-07-17
- Added canonical LLM authority docs: `CORE_RULES.md`, `LLM_INSTRUCTIONS.md`, `llm-reference.md`, `FULL_LLM_REFERENCE.md`.
- Refactored `SKILL.md` to current OpenClaw-friendly frontmatter and stricter behavior contract.
- Updated installation guidance for current OpenClaw skills workflows.
- Added `examples/FEW_SHOT_TEMPLATE.md` and standardized examples guidance.
- Added `scripts/validate-content.js` for core content validation.
- Aligned typography model guidance to `litellm/ideogram-v4`.
- Added fallback decision trees in `TOOLS.md` for generation, critique, and write constraints.

## 2.1.0 - 2026-07-17
- Prior repo baseline before core LLM/OpenClaw hardening.
