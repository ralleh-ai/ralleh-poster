# Ralleh Poster

An enterprise-grade OpenClaw skill for generating premium, non-slop event posters, performance flyers, and visual graphic assets.

This repository enforces strict analog design principles to ensure AI-generated visual assets meet professional graphic design standards. It systematically eliminates the "default AI aesthetic" (plastic rendering, volumetric clutter, hallucinated text) through a mandatory 7-stage procedural loop.

---

## 🏗️ Repository Architecture

This skill operates strictly on four authoritative documents. All generation must comply with this framework:

1. **`STANDARDS.md`** — The binding design law. Contains anti-slop rules, visual hierarchy requirements, typography constraints, genre-specific tropes, color budgets, and composition frameworks.
2. **`TEMPLATES.md`** — Reusable, high-end style presets (Swiss Minimalist, Vintage Screenprint, Woodcut, etc.) with copy-ready prompt blocks and aesthetic rules.
3. **`WORKFLOW.md`** — The mandatory 7-stage procedural loop (Intake → Research → Strategy → Concepting → Critique → Refinement → Output) that governs generation.
4. **`TOOLS.md`** — The OpenClaw integration contract, defining the required tools (`image_generate`, `image`, `web_search`) and the strict file output architecture for reproducibility.

---

## 🤖 Instructions for LLMs / AI Agents

If you are an LLM or AI agent tasked with creating a poster, you must initialize your execution context using the files in this repository. **Do not begin image generation immediately.**

### Bootstrap Sequence

1. **Load Context**: Use the `read` tool to ingest `STANDARDS.md`, `TEMPLATES.md`, `WORKFLOW.md`, and `TOOLS.md`.
2. **Acknowledge Rules**: Confirm to the requester that you have loaded the Ralleh Poster rules and understand the anti-slop constraints.
3. **Initiate Stage 1**: Begin executing `WORKFLOW.md` at Stage 1 (Intake). Ask the requester for the mandatory event details (Title, Date, Venue, Genre) if they were not provided in the initial prompt.
4. **Follow the Gates**: You must pass the exit gate of each stage in `WORKFLOW.md` before proceeding to the next.

### Starter Prompt for Agents

*(Users can copy and paste this to start a session cleanly)*

```markdown
You are an expert poster designer operating under the Ralleh Poster skill. We need to generate a high-quality, unique, non-slop performance/event poster.

To begin:
1. Read the authority files: STANDARDS.md, TEMPLATES.md, WORKFLOW.md, and TOOLS.md.
2. Acknowledge that you understand the 7-stage workflow and the anti-slop rules.
3. Start immediately with Stage 1 (Intake) and ask me for any missing event details required to proceed.
```

---

## 🚫 The Anti-Slop Guarantee

This skill is designed to prevent generic diffusion-model outputs. All outputs must pass a strict critique for:
*   **Tactile realism**: Visible paper grain, halftone dots, or physical media textures.
*   **Restricted palettes**: Maximum 4 named colors.
*   **Negative space**: At least 30% of the canvas at rest.
*   **Typographic integrity**: Either flawless short-header generation or a completely textless background plate ready for manual vector overlay. 

*If a generated plate fails these checks, the agent is instructed to reject it internally and iterate before presenting it to the user.*
