# Tools Contract & Execution Environment

**Version**: 2.1  
**Authority**: Integration spec for the Ralleh Poster skill within the OpenClaw runtime, or a standard Web AI Chat environment (such as ChatGPT, Claude, Gemini).  
**Constraint**: AI Agents and Web LLMs must use these approved tools or fallback strategies to execute the `WORKFLOW.md` loop. Do not invent commands or bypass the standardized tool APIs.

This document defines the capabilities required, the specific tool invocations expected, and the mandatory file output conventions for reproducibility across different runtime environments.

---

## 1. Image Generation (The Core Engine)

**Role**: Generate the high-fidelity visual plate for the poster (Stage 6).

### 1.1 Direct Runtime Integration (API Mode)
Use the `image_generate` tool. Ensure the prompt integrates the anti-slop directives from `STANDARDS.md` and the structural constraints from `TEMPLATES.md`.

*   **Action**: `"generate"`
*   **Model**: Override default if a specific professional model is requested. 
    *   *For Textless Plates (Method A)*: `fal/flux-pro`, `fal/flux-1.1-pro` for highest fidelity analog emulation and texture.
    *   *For Text-Integrated Plates (Method B)*: Strongly prefer `ideogram/v2` (or the latest Ideogram version available), or fallback to `openai/dall-e-3`. Ideogram is explicitly optimized for typographic coherence.
*   **Output Format**: `png` or `webp` for highest quality lossless/near-lossless output. Avoid heavy jpeg compression artifacts that compromise analog film grain or print textures.
*   **Size**: Explicitly define size per `STANDARDS.md` §6.5 (e.g., `1080x1920` for digital portrait, or a high-res equivalent for print). Use `size` or `aspectRatio` parameters as supported by the provider.

### 1.2 Web AI Chat Integration (Conversational Mode)
If you are operating in a standard web-chat interface (such as Claude, ChatGPT, Gemini, etc.) and have **native image generation capabilities (e.g., DALL-E 3, Imagen 3, or similar)**, execute the generation directly using your internal tool. 

If you do **not have direct image-generation capabilities**, your role is to provide the final optimized prompt to the user as a clear copy-pasteable code block:
1.  Add a note explaining which model it was optimized for (e.g., "Optimized for FLUX.1 [dev]" or "Optimized for Midjourney v6").
2.  Provide a clear one-line copy-paste button wrapper.
3.  Instruct the user on how to run it and ask them to upload the result once generated so you can perform the Stage 5/6 Critique step.

**Mandatory Prompt Practice (All Environments)**:
The prompt used must be the refined, final prompt resulting from `WORKFLOW.md` Stage 6, explicitly incorporating color restrictions and tactile keywords.

---

## 2. Image Analysis (Quality Assurance)

**Role**: Critique generated poster drafts, verify slop absence, and confirm typography space (Stage 5 and Stage 6).

### 2.1 Direct Runtime Integration (API Mode)
Use the `image` tool (vision analysis) to inspect the generated asset before presenting it to the user.

### 2.2 Web AI Chat Integration (Conversational Mode)
If you are in a web chat interface, **request the user upload the generated image file** so that your internal vision capability can inspect it. Once uploaded, run your visual critique against the `STANDARDS.md` criteria.

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
If you do not have write access to the user's filesystem:
1.  Output the **Design Rationale** and the **Technical Manifest** as clear, copy-pasteable markdown blocks in the chat.
2.  Provide instructions for the user to save these locally alongside their final image asset for future reference.

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

---

## 4. Web Search (Context Gathering)

**Role**: Gather artist research, venue visual context, and regional aesthetic references (Stage 2).

**Execution Contract**:
Use the `web_search` and `web_fetch` tools to ground the design in reality.

**Mandatory Uses**:
*   Search `[Performer Name] concert poster art` or `[Venue Name] architecture interior` to inform the Stage 2 Mood Board.
*   Verify exact spelling of venue names and performer billing if the requester provides ambiguous input.
