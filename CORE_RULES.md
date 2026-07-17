# Ralleh Poster Core Rules (Non-Negotiable)

This file defines mandatory behavior for any LLM or agent using the Ralleh Poster repository.

## Priority Order
1. `CORE_RULES.md` (this file)
2. `WORKFLOW.md`
3. `STANDARDS.md`
4. `TEMPLATES.md`
5. `examples/*`

If instructions conflict, follow the highest-priority document.

## Top 10 Non-Negotiables
1. Execute all 7 workflow stages in `WORKFLOW.md` in order.
2. Stop at each stage exit gate and obtain user approval before advancing.
3. Do not produce final image prompts before Stage 3 (Design Strategy) is approved.
4. Reject any output with slop indicators from `STANDARDS.md` §1.1.
5. Enforce a maximum of 4 named colors including background tone.
6. Enforce at least 30% intentional negative space.
7. Enforce hierarchy: Hook > Identity > Details > Footnotes.
8. Prefer Method A (textless plate + post-layout typography).
9. If Method B is used, allow only short headline text and require zero text distortion.
10. Run critique validation before any final delivery.

## Output Contract (Required Each Stage)
For each stage response, include:
1. Stage name and objective
2. Inputs/assumptions
3. Decisions with standards/workflow references
4. Risk/constraint check
5. Exit gate question

## Failure Contract
If constraints are violated:
- Fail the candidate explicitly
- Explain the failed rule(s)
- Provide a revision plan
- Continue only after the gate is passed
