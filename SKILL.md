---
name: ralleh-poster
description: Generate premium, non-slop event posters using a strict 7-stage workflow and hard analog design constraints. Use for event posters, gig flyers, concert/theater bills, festival and community-event prints. Do not use for logos, brand systems, generic social posts, or non-event illustrations.
metadata: {"openclaw":{"os":["linux","darwin","win32"]}}
---

# Ralleh Poster — OpenClaw Skill

This file is the single entrypoint. The design law lives in `STANDARDS.md`; the execution loop lives in `WORKFLOW.md`.

---

## 1. When To Use

Use this skill for: event posters, gig flyers, concert/theater bills, festival prints, community-event prints.
Do not use for: logos, brand systems, generic social posts, product mocks, non-event illustration.

## 2. Authority Chain (read on demand, in this order)

1. `SKILL.md` — this file.
2. `WORKFLOW.md` — mandatory 7-stage execution loop and per-stage exit gates.
3. `STANDARDS.md` — binding design law.
4. `TEMPLATES.md` — reusable style scaffolds and prompt blocks.
5. `TOOLS.md` — tool contract, fallbacks, output architecture.
6. `examples/` — success/failure calibration.

If instructions conflict, higher-priority file wins. If conflict crosses this file and `STANDARDS.md`, hard design constraints in `STANDARDS.md` win.

## 3. Non-Negotiables (canonical)

1. Execute all 7 stages in `WORKFLOW.md` in order.
2. Stop at every stage exit gate and obtain user approval before advancing.
3. Do not produce final image prompts before Stage 3 is approved.
4. Reject any output exhibiting slop indicators — see `STANDARDS.md` §1.1.
5. Maximum 4 named colors including background tone — see `STANDARDS.md` §5.1.
6. Minimum 30% intentional negative space — see `STANDARDS.md` §6.2.
7. Enforce hierarchy Hook > Identity > Details > Footnotes — see `STANDARDS.md` §2.
8. Prefer Method A (textless plate + post-layout typography) — see `STANDARDS.md` §3.1.
9. If Method B (baked-in text) is used: short headline only (≤8 words), zero character distortion, vision-verified — see `STANDARDS.md` §3.1.
10. Run critique validation (`WORKFLOW.md` Stage 5) before final delivery.
11. **Minimal Intake First**: Stage 1 requires only 4 core facts initially (Title, Date/Time, Venue, Genre). Remaining details are collected progressively.
12. **Mandatory Thumbnail Round**: run preview thumbnails before any full-quality final render.

## 4. Per-Stage Output Contract

Every stage response must include:
1. Stage name and objective.
2. Inputs and assumptions.
3. Decisions with explicit `STANDARDS.md` / `WORKFLOW.md` references.
4. Risk and constraint check.
5. Exit-gate question to the user.

## 5. Failure Contract

If any hard rule in §3 fails on a candidate:
1. Fail the candidate explicitly.
2. Name failed rule(s) with section references.
3. Provide a concrete revision plan.
4. Continue only after the corresponding exit gate passes.

## 6. Tool Contract

Primary tools:
- `image_generate` — poster generation.
- `image` — vision critique.
- `web_search` / `web_fetch` — research.
- `write` / `edit` / `exec` — artifacts under `output/<event-slug>/`.

Model routing rule of thumb:
- Method A (textless plate) → `fal/flux-pro`.
- Method B (baked-in short header) → `litellm/ideogram-v4`.

Fallbacks:
- No image generation tool: return refined prompt + rationale + settings for user-run generation.
- No vision tool: run explicit checklist self-critique and mark confidence limits.
- No file write: return markdown artifacts without claiming local persistence.

## 7. Web-UI Bootstrap (ChatGPT / Claude / Gemini / etc.)

If operating in a web chat UI and not inside OpenClaw runtime:
1. Read `SKILL.md`, `WORKFLOW.md`, `STANDARDS.md`, `TEMPLATES.md`.
2. Read `examples/README.md` plus one success and one failure example.
3. Open with Stage 1 compact intake (below).
4. Pause at every stage exit gate in `WORKFLOW.md`.
5. If no native image generation, Stage 6 deliverable is a refined copy-paste prompt.

Opening message (first turn):

```markdown
### 🎨 Ralleh Poster: Design Initialization Complete

Loaded: SKILL.md, WORKFLOW.md, STANDARDS.md, TEMPLATES.md.

**Stage 1: Quick Intake (minimal, no overwhelm)**
1. **Event Title**
2. **Date & Time**
3. **Venue / Location**
4. **Genre / Event Type**

Optional now (we can refine later): billing order, sponsor, style preference, references, format/output specs.
```

## 8. Success Criteria

Delivery is complete only when:
1. Stage 1 core facts are confirmed.
2. All 7 stages run in order, every exit gate passed.
3. Thumbnail round is completed and a winner is selected before full final render.
4. Hard rules in §3 pass on final output.
5. Package includes poster asset, design rationale, technical manifest (provider/model/prompt/size and seed if available).
