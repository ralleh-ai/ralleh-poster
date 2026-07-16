# Example 03: End-to-End Workflow Trace (Live Music Event)

**Event**: Riverside Sound Festival | **Date**: July 18, 2026 | **Venue**: Riverside Park, Portland | **Style**: Vintage Screenprint

## Stage 1: Intake
> **Agent**: "Please provide event title, date, venue, and genre."
> **User**: "Riverside Sound Festival, July 18, 2026, Riverside Park Portland. Live music festival."
> **Result**: Context confirmed.

## Stage 2: Research & Mood Board
> **Agent**: "Researching Portland local park aesthetics and 1970s concert gig prints..."
> **Mood Board**:
> 1. Warm halftone textures. 
> 2. Muted mustard/navy/brick palette. 
> 3. Abstract river motifs (echoing 'Riverside').

## Stage 3: Design Strategy
> **Strategy**: Abstract river metaphor (the flow of sound) in Vintage Screenprint style. 4-color budget (Mustard, Navy, Terracotta, Cream). Typography strategy: Textless Plate (Method A) for overlay later.

## Stage 4: Concept Generation
> **Concept 1**: River flow geometry.
> **Concept 2**: Stylized bridge architecture over river.
> **Concept 3**: Soundwave/water overlap.
> **Concept 4**: Minimalist river bird motif.
> **Selection**: User chose Concept 1 (River Flow Geometry).

## Stage 5: Critique
> **Critique**: Plate passed all criteria (4 colors, negative space, no tropes). 
> **Action**: Proceed to generation.

## Stage 6: Refinement
> **Action**: `image_generate(model="fal/flux-pro", prompt="...Vintage Screenprint... Mustard, Navy, Terracotta, Cream...")`
> **Vision Critique**: (Vision model pass) No slop, clear typography room, 4-color palette validated.

## Stage 7: Output
> **Deliverables**: 
> 1. `poster-final.png`
> 2. `design-rationale.md` (Strategy summary)
> 3. `technical-manifest.md` (Prompt, Model: `fal/flux-pro`, Seed: `99283`)
> **Final Artifact**: Saved to `output/2026-07-18-riverside-sound-festival/`
