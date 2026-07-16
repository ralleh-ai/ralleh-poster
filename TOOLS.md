# Tools

This document defines the tools required to execute the poster generation workflow. When operating as an AI agent, use your runtime's equivalent capability for each role listed below.

---

## Image Generation

**Role**: Generate the visual plate for the poster.

**Requirements**: The model must support high-resolution outputs with strong compositional control and aesthetic quality. Preference for models capable of fine-grained lighting and texture detail (e.g., film grain, paper texture, analog print artifacts).

**Recommended Models**:
- `fal/flux-pro` or `fal/flux-1.1-pro` — Best for detailed, high-fidelity image quality.
- `fal/flux-2-max` — When maximum resolution output is needed.
- `openai/gpt-image-1` or `openai/dall-e-3` — Suitable for structured layout and text integration.
- Fallback: Any high-quality diffusion model available in your runtime.

**Resolution Targets**:
- Digital (Social / Screen): `1080x1920` (portrait) or `1080x1080` (square)
- Print (standard): `2480x3508` at 300 DPI or equivalent

---

## Web Search

**Role**: Gather artist research, venue visual context, and regional aesthetic references.

**Requirements**: Live web search capability. Used primarily in Stage 2 (Research).

**Use for**:
- Searching performer/artist name + "poster" or "concert art" to identify their visual history.
- Searching venue name + "architecture" or "interior" to establish physical context.
- Finding regional design traditions or genre-specific aesthetics.

---

## File Handling / Storage

**Role**: Store generated assets, prompts, and design rationale for reproducibility.

**Requirements**: Ability to read and write files in the working directory.

**Expected File Structure**:
```
output/
  <event-slug>/
    poster-final.<png|jpg|webp>
    design-rationale.md
    prompts.md
    concepts/
      concept-01.md
      concept-02.md
      ...
```

**File Naming Convention**:
- Event slug: lowercase, hyphen-separated, e.g., `summer-jazz-festival-2026`
- Use ISO date prefix for time-sensitive production: `2026-08-15-summer-jazz-festival`

---

## Image Analysis / Vision

**Role**: Review generated poster drafts, identify layout issues, critique visual quality.

**Requirements**: Vision-capable model to inspect output images.

**Use for**:
- Comparing generated poster against design brief.
- Detecting legibility issues (text too small, poor contrast, cluttered composition).
- Confirming the anti-slop criteria are met before final output.

---

## Text / Document Editing

**Role**: Write design rationale, prompts, concepts, and update workflow checklists.

**Requirements**: Standard text editing and file creation capability.

---

## Optional: Canvas / Vector Output

**Role**: Provide a clean base for typography overlay or final layout composition when the image model cannot reliably render clean text.

**Strategy**: Generate the background visual plate first as an image, then overlay typography using a separate design or compositing step. This ensures type quality is never dependent solely on the image model's text rendering.
