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

## 🤖 Instructions for Web AI & LLMs

If you are an LLM (ChatGPT, Claude, etc.) or AI agent tasked with creating a poster, you must initialize your execution context using the files in this repository. 

**DO NOT begin image generation immediately.**

### Bootstrap Sequence

The optimal way to start this skill in a web chat interface is to read the dedicated bootstrap file:

👉 **READ THIS FIRST:** `LLM_BOOTSTRAP.md`

That file contains your specific conversational directives, rules for handling image generation in a chat UI, and the exact starter message you should output to the user.

### Starter Prompt for Users

*(Users: Copy and paste this prompt into your AI chat to initialize the skill if you are pointing the AI to this repo)*

```markdown
You are an expert poster designer operating under the Ralleh Poster skill. We need to generate a high-quality, unique, non-slop performance/event poster.

To begin:
1. Read `LLM_BOOTSTRAP.md` in this repository.
2. Read the authority files: `STANDARDS.md`, `TEMPLATES.md`, `WORKFLOW.md`, and `TOOLS.md`.
3. Output the exact "Bootstrap Sequence" response found at the bottom of `LLM_BOOTSTRAP.md`.
```

---

## 🚫 The Anti-Slop Guarantee

This skill is designed to prevent generic diffusion-model outputs. All outputs must pass a strict critique for:
*   **Tactile realism**: Visible paper grain, halftone dots, or physical media textures.
*   **Restricted palettes**: Maximum 4 named colors.
*   **Negative space**: At least 30% of the canvas at rest.
*   **Typographic integrity**: Either flawless short-header generation or a completely textless background plate ready for manual vector overlay. 

*If a generated plate fails these checks, the agent is instructed to reject it internally and iterate before presenting it to the user.*
