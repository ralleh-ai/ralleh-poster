# Tools Contract & Execution Environment

**Version**: 2.0  
**Authority**: Integration spec for the Ralleh Poster skill within the OpenClaw runtime.  
**Constraint**: AI Agents must use these approved tools to execute the `WORKFLOW.md` loop. Do not invent commands or bypass the standardized tool APIs.

This document defines the capabilities required, the specific tool invocations expected, and the mandatory file output conventions for reproducibility.

---

## 1. Image Generation (The Core Engine)

**Role**: Generate the high-fidelity visual plate for the poster (Stage 6).

**Execution Contract**:
Use the `image_generate` tool. Ensure the prompt integrates the anti-slop directives from `STANDARDS.md` and the structural constraints from `TEMPLATES.md`.

**Preferred Configuration**:
*   **Action**: `"generate"`
*   **Model**: Override default if a specific professional model is requested (e.g., `fal/flux-pro`, `fal/flux-1.1-pro` for highest fidelity analog emulation). If text rendering is required (Method B), ensure a capable model like `flux-pro` or `dall-e-3` is targeted.
*   **Output Format**: `png` or `webp` for highest quality lossless/near-lossless output. Avoid heavy jpeg compression artifacts that compromise analog film grain or print textures.
*   **Size**: Explicitly define size per `STANDARDS.md` §6.5 (e.g., `1080x1920` for digital portrait, or a high-res equivalent for print). Use `size` or `aspectRatio` parameters as supported by the provider.

**Mandatory Practice**:
The prompt passed to `image_generate` must be the refined, final prompt resulting from `WORKFLOW.md` Stage 6, explicitly incorporating color restrictions and tactile keywords.

---

## 2. Image Analysis (Quality Assurance)

**Role**: Critique generated poster drafts, verify slop absence, and confirm typography space (Stage 5 and Stage 6).

**Execution Contract**:
Use the `image` tool (vision analysis) to inspect the generated asset before presenting it to the user.

**Critique Prompt Requirements**:
When calling the `image` tool to inspect a draft, the prompt must ask the vision model to explicitly verify:
1.  Are there hallucinated text glyphs?
2.  Is the color palette restricted to 3-4 distinct colors?
3.  Is there a clear, uncluttered zone (minimum 30% negative space) suitable for placing event typography?
4.  Are there any "slop" indicators (plastic skin, volumetric overload, generic neon glow)?

If the vision model identifies failures on these points, the agent must reject the plate, adjust the `image_generate` prompt, and try again.

---

## 3. File System & Output Architecture

**Role**: Store generated assets, prompts, design rationales, and concept drafts for future reproducibility and human handoff (Stage 7).

**Execution Contract**:
Use the `exec`, `write`, or `edit` tools to create directories and save files in the working directory.

### 3.1 Standardized Directory Structure
All generated work must be organized under an `output/` directory in the skill root (or the designated project workspace).

```text
output/
  └── <event-slug>/
      ├── poster-final.<png|webp|jpg>
      ├── design-rationale.md
      ├── technical-manifest.md
      └── concepts/
          ├── concept-01.md
          ├── concept-02.md
          └── ...
```

### 3.2 Naming Conventions
*   **Event Slug**: Lowercase, hyphen-separated string incorporating the date (if time-sensitive) and event name.
    *   *Example*: `2026-08-15-summer-jazz-festival`
    *   *Example*: `q3-all-hands-meeting`

### 3.3 Deliverable File Contents
*   **`poster-final.*`**: The final approved image asset.
*   **`design-rationale.md`**: The explanation of creative choices, color palette, and metaphor (output from Stage 7).
*   **`technical-manifest.md`**: The exact provider, model name, aspect ratio, seed (if available), and final prompt string used for the final generation. This ensures the design can be reproduced or modified later.
*   **`concepts/*.md`**: The text drafts of the concepts generated in Stage 4.

---

## 4. Web Search (Context Gathering)

**Role**: Gather artist research, venue visual context, and regional aesthetic references (Stage 2).

**Execution Contract**:
Use the `web_search` and `web_fetch` tools to ground the design in reality.

**Mandatory Uses**:
*   Search `[Performer Name] concert poster art` or `[Venue Name] architecture interior` to inform the Stage 2 Mood Board.
*   Verify exact spelling of venue names and performer billing if the requester provides ambiguous input.

---

## 5. Future Extensibility (Scripts)

The `scripts/` directory is reserved for future automated layout compositing (e.g., Python scripts using Pillow or ImageMagick to automatically overlay typography onto textless plates). Until those scripts are provisioned, typography must be handled either by Method B (direct generation of short headers) or manual post-processing by the user on the delivered textless plate.
