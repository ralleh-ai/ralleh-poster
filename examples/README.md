# Examples Directory (Few-Shot Calibration)

This directory is optimized for LLM few-shot learning and Stage 5 critique calibration.

## How an LLM Must Use These Examples
- Compare every candidate output against both success and failure examples.
- Use failures as hard anti-pattern detectors.
- If a candidate resembles failure patterns, reject and refine.
- Always map critique notes to explicit standards/workflow references.

## Required Example Structure
All examples should follow `examples/FEW_SHOT_TEMPLATE.md` and include:
1. metadata (outcome/type/checkpoint/rules)
2. event brief
3. strategy/prompt
4. critique mapping
5. result summary
6. lesson captured
7. technical manifest

## Available Cases

- `example-01-success-minimalist.md`
- `example-02-failure-slop.md`
- `example-03-end-to-end.md`
- `example-04-success-vintage-screenprint.md`
- `example-05-failure-typography.md`
- `example-06-success-theater-conceptual.md`
- `example-07-success-early-brief-discipline.md`
- `example-08-success-brief-discovery-discipline.md`
## Adding New Examples
1. Copy `examples/FEW_SHOT_TEMPLATE.md`.
2. Name file as `example-XX-<success|failure>-<theme>.md`.
3. Fill all required sections.
4. Link the new file in this README.

## Draft Stub Workflow (Phase 13/14)
- Run `npm run stage-stubs:materialize` to auto-create missing-stage draft stubs in `examples/drafts/`.
- Draft files are intentionally named `draft-stage-XX-coverage.md` so they are **not** included in strict example scoring until finalized.
- Promote a draft with `npm run stage-stubs:promote -- --stage <n> --theme <slug> [--mode success|failure]`.
  - Example: `npm run stage-stubs:promote -- --stage 1 --theme early-brief-discipline --mode success`
- Promotion workflow auto-updates `examples/README.md`, runs preflight validation, and rolls back on failure.
- Guardrail: promotion is blocked if score drops or warning count rises vs baseline (override with `--allow-regression`).
