# Example 02: Slop Failure — Live Music Festival

**Status**: ❌ Rejected at Stage 5 (Critique). Regenerated after prompt refinement.

This example demonstrates how the Ralleh Poster workflow catches AI slop before it reaches the user. The initial generation was produced from an under-constrained prompt. The Critique stage caught 5 rule violations, forcing regeneration.

## 1. Event Brief
*   **Title**: Riverside Sound Festival
*   **Date/Time**: Saturday, July 18, 2026 · Gates 4:00 PM
*   **Venue**: Riverside Park, Portland
*   **Genre**: Live Music (multi-band day festival)
*   **Style Preference**: (Not specified — free direction)

## 2. Initial (Flawed) Prompt
```text
Create a poster for Riverside Sound Festival at Riverside Park. Music festival vibe with band performing, colorful lights, exciting atmosphere.
```

## 3. Initial Output — Slop Indicators Detected
The generated image contained the following defects:

| Slop Indicator | `STANDARDS.md` Reference | Observation |
|---|---|---|
| Plastic rendering | §1.1 | Guitars and microphones rendered with hyper-glossy CGI-grade material shading |
| Volumetric overload | §1.1 | Multiple lens flares, floating dust motes, and god-ray beams from stage lights |
| Vibrant clutter | §1.1 | Full-canvas neon gradients competing for attention with crowd, band, and typography |
| Hallucinated text | §1.1 | Warped, illegible pseudo-letter forms in three locations of the canvas |
| Generic symbol overload | §4.1 | Floating microphone, generic acoustic guitar, neon soundwave graphics — all cliché live-music tropes |
| Palette violation | §5.1 | 8+ unrestricted saturated colors, no named palette |
| Negative space violation | §6.2 | 0% negative space — every pixel filled with details |

**Result**: Every single one of the 4 critique rubric criteria in `WORKFLOW.md` §5.1 failed.

## 4. Stage 5 Critique Verdict
> ❌ REJECTED. The plate exhibits 6 of the 7 critical slop indicators from `STANDARDS.md` §1.1 and violates the palette, hierarchy, and negative space rules. Regeneration required with strict prompt refinement.

## 5. Corrective Design Strategy (Regeneration)
The agent returned to `WORKFLOW.md` Stage 3 and produced a proper Design Strategy:

*   **Metaphor**: An abstract river silhouette suggesting the flow of a full day of sound, rather than literal band imagery.
*   **Style**: Vintage Screenprint (from `TEMPLATES.md`).
*   **Palette**: Mustard Yellow `#D9A441`, Deep Navy `#1F2E4C`, Terracotta `#B45939`, Cream Canvas `#F5EFE0`.
*   **Typography Strategy**: Method A (Textless Plate). Header applied post-generation.

## 6. Corrected Prompt
```text
An authentic 1970s concert gig poster plate. Handcrafted silkscreen print style, textured Risograph overlay, visible ink bleed, subtle dot halftone patterns, and warm paper grain. A stylized flat-graphic river silhouette flowing diagonally through the composition, rendered in bold, flat layers with organic imperfections. Colors: warm mustard yellow, deep navy, and terracotta on a cream canvas background. Zero digital rendering, zero plastic gloss, textless plate. Aspect ratio 2:3 portrait.
```

## 7. Corrected Result — Passes Critique
| Rule | Compliance |
|---|---|
| §1.1 Slop indicators | ✅ Zero present |
| §1.2 Tactile texture | ✅ Halftone dots and ink-bleed grain clearly visible |
| §4.1 Genre tropes | ✅ Zero floating microphones, guitars, or neon soundwaves |
| §5.1 Color budget | ✅ Exactly 4 named colors |
| §6.2 Negative space | ✅ 40% at rest |

## 8. Lesson Captured
Under-constrained prompts produce slop. Every image-generation prompt must incorporate:
1.  A `TEMPLATES.md` style anchor.
2.  A named 3-4 color palette.
3.  Explicit anti-slop language ("zero gradients", "zero glow", "matte paper", "textless plate").
4.  A single visual metaphor — never a literal depiction of "the whole event".

This is precisely why `WORKFLOW.md` requires Stages 1-3 (Intake, Research, Strategy) *before* any image generation is permitted.
