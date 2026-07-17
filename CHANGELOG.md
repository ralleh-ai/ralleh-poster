# Changelog

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
