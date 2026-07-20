# Tools Contract & Execution Environment

**Version**: 2.1  
**Authority**: Integration spec for the Ralleh Poster skill within the OpenClaw runtime, or a standard Web AI Chat environment (such as ChatGPT, Claude, Gemini).  
**Constraint**: AI Agents and Web LLMs must use these approved tools or fallback strategies to execute the `WORKFLOW.md` loop. Do not invent commands or bypass the standardized tool APIs.

This document defines the capabilities required, the specific tool invocations expected, and the mandatory file output conventions for reproducibility across different runtime environments.

---

## 1. Image Generation (The Core Engine)

**Role**: Generate the high-fidelity visual plate for the poster (Stage 6).

### 1.0 Preview-First Policy (mandatory)

Before any full-quality render, run a **thumbnail review round**:
- default `count=4` preview comps,
- low-cost review settings,
- strict anti-slop geometry constraints,
- requester selects a winner,
- only then proceed to final render.

For concert scenes, preview prompts must enforce:
- stage fully visible,
- crowd below stage sightline,
- no foreground occlusion crossing performer zone,
- preserved typography negative space.

### 🔑 Model Selection Rule of Thumb
> **Method A (Textless Plate) → `fal/flux-pro`** (best for tactile analog textures and screenprint aesthetics)  
> **Method B (Direct Text) → `litellm/ideogram-v4`** (best-in-class typography rendering; explicitly prefer this over any other option when text must be baked into the plate)

### 1.1 Direct Runtime Integration (API Mode)
Use the `image_generate` tool. Ensure the prompt integrates the anti-slop directives from `STANDARDS.md` and the structural constraints from `TEMPLATES.md`.

*   **Action**: `"generate"`
*   **Model**: Override default if a specific professional model is requested. 
    *   *For Textless Plates (Method A)*: `fal/flux-pro`, `fal/flux-1.1-pro` for highest fidelity analog emulation and texture.
    *   *For Text-Integrated Plates (Method B)*: Strongly prefer `litellm/ideogram-v4` (or the latest Ideogram version available), or fallback to `openai/dall-e-3`. Ideogram is explicitly optimized for typographic coherence.
*   **Output Format**: `png` or `webp` for highest quality lossless/near-lossless output. Avoid heavy jpeg compression artifacts that compromise analog film grain or print textures.
*   **Size**: Explicitly define size per `STANDARDS.md` §6.5 (e.g., `1080x1920` for digital portrait, or a high-res equivalent for print). Use `size` or `aspectRatio` parameters as supported by the provider.

### 1.1.1 Preview Settings (low-rez / thumbnails)

Use these defaults during the thumbnail round:
- portrait 4:5 aspect ratio,
- quick review constraints (textless preferred unless user requests preview text),
- shorter timeout + fast reject loop.

If the provider ignores explicit low-resolution settings, still run the thumbnail-first workflow and downscale previews for review delivery.

### 1.2 Web AI Chat Integration (Conversational Mode)
If you are operating in a standard web-chat interface (such as Claude, ChatGPT, Gemini, etc.) and have **native image generation capabilities**, execute generation directly.

If you do **not have direct image-generation capabilities**, provide the final optimized prompt as a copy-paste block and ask the user to upload the result for critique.

**Fallback Decision Tree (Generation):**
1. If Method A is selected and `fal/flux-pro` is available → generate with `fal/flux-pro`.
2. If Method B is selected and `litellm/ideogram-v4` is available → generate with `litellm/ideogram-v4`.
3. If Method B model is unavailable → fall back to Method A and produce textless plate unless requester explicitly requires baked-in type.
4. If no generation tool is available → return refined prompt + rationale + expected settings and request user-run generation.

**Mandatory Prompt Practice (All Environments):**
The prompt used must be the refined output from `WORKFLOW.md` Stage 6, including explicit palette and anti-slop constraints.

---

## 2. Image Analysis (Quality Assurance)

**Role**: Critique generated poster drafts, verify slop absence, and confirm typography space (Stage 5 and Stage 6).

### 2.1 Direct Runtime Integration (API Mode)
Use the `image` tool (vision analysis) to inspect the generated asset before presenting it to the user.

### 2.2 Web AI Chat Integration (Conversational Mode)
If you are in a web chat interface, request the user upload the generated image so internal vision can inspect it.

**Fallback Decision Tree (Critique):**
1. If `image` vision is available → run full Stage 5 critique.
2. If no vision tool is available → run explicit checklist self-critique and mark confidence limits.
3. If confidence is low without vision validation → require a user upload or regenerate with stricter constraints before approval.

### 2.3 Critique Prompt Requirements (All Environments)
When analyzing a draft, the critique step must explicitly verify:
1.  Are there any hallucinated text glyphs?
2.  Is the color palette restricted to 3-4 distinct colors?
3.  Is there a clear, uncluttered zone (minimum 30% negative space) suitable for placing event typography?
4.  Are there any "slop" indicators (plastic skin, volumetric overload, generic neon glow)?

If the visual critique identifies failures on these points, the plate must be rejected, the prompt adjusted, and a regeneration triggered or requested.

---

## 3. File System & Output Architecture

**Role**: Store generated assets, prompts, design rationales, and concept drafts for future reproducibility and human handoff (Stage 7).

### 3.1 Direct Runtime Integration (API Mode)
Use the `exec`, `write`, or `edit` tools to create directories and save files in the working directory under `output/<event-slug>/` as specified in §3.3.

### 3.2 Web AI Chat Integration (Conversational Mode)
If you do not have write access:
1. Output **Design Rationale** and **Technical Manifest** in copy-pasteable markdown.
2. Provide save instructions for user-side archiving.
3. Do not claim local persistence when write access is unavailable.

### 3.3 Standardized Directory Structure (API Mode)
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

### 3.4 Naming Conventions
*   **Event Slug**: Lowercase, hyphen-separated string incorporating the date (if time-sensitive) and event name.
    *   *Example*: `2026-08-15-summer-jazz-festival`
    *   *Example*: `q3-all-hands-meeting`

### 3.5 Deliverable File Contents
*   **`poster-final.*`**: The final approved image asset.
*   **`design-rationale.md`**: The explanation of creative choices, color palette, and metaphor (output from Stage 7).
*   **`technical-manifest.md`**: The exact provider, model name, aspect ratio, seed (if available), and final prompt string used for the final generation. This ensures the design can be reproduced or modified later.
*   **`concepts/*.md`**: The text drafts of the concepts generated in Stage 4.

Include preview lineage in `technical-manifest.md`:
- preview count,
- selected thumbnail id,
- provider route used for preview and final.

---

## 4. Web Search (Context Gathering)

**Role**: Gather artist research, venue visual context, and regional aesthetic references (Stage 2).

**Execution Contract**:
Use the `web_search` and `web_fetch` tools to ground the design in reality.

**Mandatory Uses**:
*   Search `[Performer Name] concert poster art` or `[Venue Name] architecture interior` to inform the Stage 2 Mood Board.
*   Verify exact spelling of venue names and performer billing if the requester provides ambiguous input.
