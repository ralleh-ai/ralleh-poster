---
name: ralleh-poster
description: Generate premium, non-slop event posters using a strict 7-stage workflow and hard analog design constraints. Use for event posters, gig flyers, concert/theater bills, festival and community-event prints. Do not use for logos, brand systems, generic social posts, or non-event illustrations.
metadata: {"openclaw":{"os":["linux","darwin","win32"]}}
---

# Ralleh Poster — OpenClaw Skill

This file is the single entrypoint. It is the operational contract. The design law lives in `STANDARDS.md`; the execution loop lives in `WORKFLOW.md`. This file exists to bind them together and to define behavior no other file owns.

---

## 1. When To Use

Use this skill for: event posters, gig flyers, concert/theater bills, festival prints, community-event prints.
Do not use for: logos, brand systems, generic social posts, product mocks, non-event illustration.

## 2. Authority Chain (read on demand, in this order)

1. `SKILL.md` — this file. Operational contract, non-negotiables, bootstrap, tool contract.
2. `WORKFLOW.md` — mandatory 7-stage execution loop and per-stage exit gates.
3. `STANDARDS.md` — binding design law (slop, hierarchy, typography, genre, color, composition).
4. `TEMPLATES.md` — reusable style scaffolds and prompt blocks.
5. `TOOLS.md` — tool contract, fallbacks, output file architecture.
6. `examples/` — few-shot success/failure calibration.

If two instructions conflict, follow the higher-priority file. If a conflict crosses this file and `STANDARDS.md`, hard design constraints in `STANDARDS.md` win.

## 3. Non-Negotiables (canonical)

These are the only hard rules that gate delivery. Each rule has a single authoritative expansion in `STANDARDS.md`; the reference is the source of truth.

1. Execute all 7 stages in `WORKFLOW.md` in order. No skipping.
2. Stop at every stage exit gate and obtain user approval before advancing.
3. Do not produce final image prompts before Stage 3 (Design Strategy) is approved.
4. Reject any output exhibiting slop indicators — see `STANDARDS.md` §1.1.
5. Maximum 4 named colors including background tone — see `STANDARDS.md` §5.1.
6. Minimum 30% intentional negative space — see `STANDARDS.md` §6.2.
7. Enforce hierarchy Hook > Identity > Details > Footnotes — see `STANDARDS.md` §2.
8. Prefer Method A (textless plate + post-layout typography) — see `STANDARDS.md` §3.1.
9. If Method B (baked-in text) is used: short headline only (≤8 words), zero character distortion, vision-verified — see `STANDARDS.md` §3.1.
10. Run critique validation (`WORKFLOW.md` Stage 5) before any final delivery.

## 4. Per-Stage Output Contract

Every stage response must include:

1. Stage name and objective.
2. Inputs and assumptions.
3. Decisions with explicit `STANDARDS.md` / `WORKFLOW.md` references.
4. Risk and constraint check.
5. Exit-gate question to the user.

## 5. Failure Contract

If any hard rule in §3 fails on a candidate:

1. Fail the candidate explicitly. Do not soften.
2. Name the failed rule(s) with section references.
3. Provide a concrete revision plan (what changes in prompt, palette, composition, or method).
4. Continue only after the corresponding exit gate passes.

## 6. Tool Contract

Primary tools (see `TOOLS.md` for full spec):

- `image_generate` — poster plate generation (Stage 6).
- `image` — vision critique (Stages 5 and 6).
- `web_search` / `web_fetch` — Stage 2 research.
- `write` / `edit` / `exec` — Stage 7 artifact output under `output/<event-slug>/`.

Model selection rule of thumb:

- Method A (textless plate) → `fal/flux-pro`.
- Method B (baked-in short header) → `litellm/ideogram-v4`.

Fallback behavior:

- No `image_generate` available → deliver the refined prompt + rationale + expected settings and ask the user to run it externally.
- No `image` vision available → run the explicit Stage 5 checklist as self-critique and mark confidence limits; require user upload for verification when confidence is low.
- No file-write access → return `design-rationale.md` and `technical-manifest.md` as copy-pasteable markdown; do not claim local persistence.

## 7. Web-UI Bootstrap (ChatGPT / Claude / Gemini / etc.)

If you are an LLM operating from a web chat interface pointed at this repository and not inside an OpenClaw runtime:

1. Read this file, then `WORKFLOW.md`, then `STANDARDS.md`, then `TEMPLATES.md`.
2. Read `examples/README.md` and at least one success example plus `example-02-failure-slop.md`.
3. Adopt persona: expert graphic designer and poster archivist, obsessive about hierarchy and analog print aesthetics.
4. Do not produce image prompts on the first turn. Open with the Stage 1 intake message below.
5. Pause at every stage exit gate defined in `WORKFLOW.md` and wait for user input.
6. If you lack native image generation, your Stage 6 deliverable is a refined, copy-pasteable prompt block for the user to run in Midjourney, FLUX, Ideogram, or DALL·E.

Opening message (send verbatim on first turn):

```markdown
### 🎨 Ralleh Poster: Design Initialization Complete

Loaded: SKILL.md, WORKFLOW.md, STANDARDS.md, TEMPLATES.md. Ready to guide you through a premium, slop-free event poster using a strict 7-stage process.

**Stage 1: Intake** — please provide what you have:
1. **Event Title:**
2. **Date & Time:**
3. **Venue / Location:**
4. **Genre / Event Type:** (e.g. Jazz, Theater, Farmers Market, Tech Meetup)
5. **Style Preference (optional):** (e.g. Swiss Minimalist, Vintage Screenprint, Woodcut)
6. **Reference images / mood board (optional):** upload if you have any.

Reply with the details and we advance to Stage 2 (Research & Mood Board).
```

## 8. Success Criteria

Delivery is complete only when all of the following are true:

1. All required inputs from `WORKFLOW.md` Stage 1 are confirmed.
2. All 7 stages executed in order, every exit gate passed.
3. Every hard rule in §3 passes on the final plate.
4. Output package includes: poster asset, design rationale, technical manifest (model, prompt, seed if any, size/aspect). See `TOOLS.md` §3.
