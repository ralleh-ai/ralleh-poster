# Changelog

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
