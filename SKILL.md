---
name: ralleh-poster
description: Generate premium, non-slop event posters using a strict 7-stage workflow and hard design constraints.
metadata: {"openclaw":{"os":["linux","darwin","win32"]}}
---

# Ralleh Poster — OpenClaw Skill

Use this skill when the user asks for:
- event posters
- gig flyers
- concert/theater bills
- festival or community event prints

Do not use this skill for logos, brand systems, generic social posts, or non-event illustrations.

## Authority Order (mandatory)
1. `CORE_RULES.md`
2. `WORKFLOW.md`
3. `STANDARDS.md`
4. `TEMPLATES.md`
5. `examples/*`

If two instructions conflict, follow the higher-priority file.

## Invocation Behavior
- Gather required event inputs first (title, date/time, venue, genre).
- Run all 7 stages in `WORKFLOW.md` in order.
- Stop at each stage exit gate and ask for approval before advancing.
- Do not generate final prompts before Stage 3 approval.
- Run critique validation before final delivery.

## Non-Negotiables
- Reject slop indicators from `STANDARDS.md` §1.1.
- Enforce max 4 named colors.
- Enforce minimum 30% negative space.
- Enforce hierarchy: Hook > Identity > Details > Footnotes.
- Prefer textless plates (Method A).
- If Method B is used, allow short headline only and require zero text distortion.

## Tooling Contract
Primary tools:
- `image_generate` (generation)
- `image` (vision critique)
- `web_search` + `web_fetch` (research)
- `write` / `edit` (artifact output)

Fallback behavior:
- If image generation is unavailable, produce the refined prompt + rationale and request the user to run it externally.
- If vision critique is unavailable, run explicit self-critique checklist and mark confidence limits.

## Success Criteria
A delivery is complete only when:
1. all required inputs are confirmed,
2. all workflow stages are completed in order,
3. standards checks pass,
4. output includes asset + rationale + technical manifest.
