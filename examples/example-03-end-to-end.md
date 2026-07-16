# Example 03: End-to-End Workflow Trace (Live Music Event)

**Event**: Riverside Sound Festival | **Date**: July 18, 2026 | **Venue**: Riverside Park, Portland | **Style**: Vintage Screenprint

## Stage 1: Intake
> **Agent**: "Please provide event title, date, venue, and genre. Do you have any reference images?"
> **User**: "Riverside Sound Festival, July 18, 2026, Riverside Park Portland. Live music festival. No reference images."
> **Result**: Context confirmed. Exit Gate passed.

## Stage 2: Research & Mood Board
> **Agent**: "Researching Portland local park aesthetics and 1970s concert gig prints..."
> **Mood Board**:
> 1. Warm halftone textures and visible ink bleed. 
> 2. Muted mustard/navy/brick palette (classic regional aesthetic). 
> 3. Abstract river motifs (echoing 'Riverside', avoiding generic guitars).
> **Result**: Mood board presented and approved. Exit Gate passed.

## Stage 3: Design Strategy
> **Agent**: "Here is the proposed design strategy:"
> *   **Metaphor**: Abstract river contour lines wrapping around a central sun — representing the flow of a full day of sound without relying on literal band imagery.
> *   **Style**: Vintage Screenprint (from `TEMPLATES.md`).
> *   **Palette**: Mustard Yellow `#D9A441`, Deep Navy `#1F2E4C`, Terracotta `#B45939`, Cream Canvas `#F5EFE0`.
> *   **Typography Strategy**: Method A (Textless Plate). We will leave the top 30% of the canvas as clean cream canvas for heavy headline typography overlay later.
> **Result**: Strategy aligns with `STANDARDS.md`. Exit Gate passed.

## Stage 4: Concept Generation
> **Concept 1**: River contour geometry wrapping a sun.
> **Concept 2**: Stylized bridge architecture over river in duotone.
> **Concept 3**: Layered halftone soundwave merging into water ripples.
> **Concept 4**: Minimalist river bird motif in block ink.
> **Selection**: User chose Concept 1 (River Contour Geometry). Exit Gate passed.

## Stage 5: Critique
> **Agent**: Evaluating Concept 1 against `STANDARDS.md`:
> 1. **Slop Prevention**: Analog screenprint texture specified. No 3D/plastic elements.
> 2. **Hierarchy**: High contrast river/sun provides strong Hook.
> 3. **Typography**: Top 30% reserved as negative space (Cream Canvas) for text.
> 4. **Color**: Exactly 4 named colors used.
> **Critique Result**: Plate passed all criteria. Proceed to generation.

## Stage 6: Refinement
> **Action**: `image_generate` called with model `fal/flux-pro` for highest analog texture fidelity.
> **Prompt used**: "An authentic 1970s concert gig poster plate. Handcrafted silkscreen print style, textured Risograph overlay, visible ink bleed... abstract river contour lines wrapping a central sun... Colors: mustard yellow, deep navy, terracotta, on a cream canvas background. Top 30% is clean cream canvas. Zero digital rendering, zero plastic gloss, textless plate. Aspect ratio 2:3."
> **Vision Critique**: (Vision model inspection) No slop detected, 4-color palette validated, top third is clear for text. Exit Gate passed.

## Stage 7: Output
> **Deliverables**: 
> 1. `poster-final.png`
> 2. `design-rationale.md`: "This poster leverages the Vintage Screenprint template to capture the outdoor, all-day energy of the Riverside Sound Festival. By using abstract river contours instead of generic instruments, we subvert tropes while maintaining a 4-color analog aesthetic. The top third is deliberately left blank for clear typographic hierarchy."
> 3. `technical-manifest.md`: "Model: `fal/flux-pro`, Size: `2480x3720`, Seed: `99283`, Final Prompt: [Prompt from Stage 6]."
> **Final Artifact**: Saved to `output/2026-07-18-riverside-sound-festival/`
