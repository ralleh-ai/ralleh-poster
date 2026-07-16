# Example 05: Typography Failure — Tech Meetup

**Status**: ❌ Rejected at Stage 5 (Critique). Regenerated after prompt refinement.

This example highlights the dangers of using Method B (Direct High-Fidelity Text Rendering) with the wrong model and a cluttered background, violating legibility and hierarchy rules.

## 1. Event Brief
*   **Title**: Future of AI in Design
*   **Date/Time**: Tuesday, September 10, 2026 · 6:00 PM
*   **Venue**: The Innovation Hub, Berlin
*   **Genre**: Tech Meetup / Conference
*   **Style Preference**: Modern Abstract Conceptual

## 2. Initial (Flawed) Prompt
```text
A modern abstract conceptual poster for a tech meetup. Elegant overlapping geometric translucent shapes. Colors: deep midnight blue, plum, sandstone. Include the text "Future of AI in Design" in a modern font.
```

## 3. Initial Output — Critique Findings
The generated image was analyzed via vision critique. The model (a standard non-typographic image generator) produced the following defects:

| Defect | `STANDARDS.md` Reference | Observation |
|---|---|---|
| Hallucinated Glyphs | §1.1 | The text rendered as "Futre of Al in Dasign" with warped, melting letters. |
| Contrast / Background | §3.3 | The text was placed directly over the intersecting translucent shapes, making the first half of the word illegible against the dark plum background. |
| Method B Violation | §3.1 | The model attempted to render event text without passing the zero-distortion check, and it was not a short 8-word headline (it added pseudo-dates below). |

**Result**: Failed typography and hierarchy gates.

## 4. Corrective Design Strategy (Regeneration)
The agent corrected the approach by explicitly routing to a typography-capable model and instructing it to use negative space for the text.

*   **Metaphor**: A single, clean intersecting glassmorphic plane.
*   **Style**: Modern Abstract Conceptual.
*   **Typography Strategy**: Method B (Direct Text), explicitly utilizing `ideogram/v2`.
*   **Correction**: We will prompt for *only* the main header ("Future of AI in Design"), and force the text to sit in the clean sandstone-colored negative space, not overlapping the complex shapes.

## 5. Corrected Prompt
```text
A contemporary abstract conceptual art poster plate. The top half is clean, solid warm sandstone sand color. In the center of this clean space, perfectly legible, crisp typography reads exactly "Future of AI in Design" in a bold, modern sans-serif font in deep midnight blue. The bottom half contains elegant, minimalist overlapping translucent geometric shapes in deep midnight blue and muted plum. Very clean, quiet elegance, textured matte paper, zero neon. Aspect ratio 2:3.
```

## 6. Corrected Result
| Rule | Compliance |
|---|---|
| §1.1 Slop indicators | ✅ Zero hallucinated glyphs, crisp text. |
| §3.1 Typography | ✅ Method B executed flawlessly using Ideogram v2. Text is perfectly spelled. |
| §3.3 Legibility | ✅ Text sits on a solid, high-contrast sandstone background. Zero overlap with busy shapes. |

## 7. Lesson Captured
When using Method B (Direct Text):
1. **Model matters**: You must use a model optimized for text (like `ideogram/v2`).
2. **Placement matters**: You must explicitly prompt the model to place text in a clean, solid-colored zone. If text overlays complex geometry, it will fail legibility constraints.
