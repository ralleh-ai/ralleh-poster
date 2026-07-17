# Example 05: Typography Failure — Tech Meetup

- Outcome: Failure → Recovered
- Example Type: Negative
- Primary Stage Checkpoint: Stage 5
- Primary Rules Referenced: §1.1, §2.1, §3.1, §3.3, §5.1

## 1) Event Brief
- Title: Future of AI in Design
- Date/Time: Tuesday, September 10, 2026 · 6:00 PM
- Venue: The Innovation Hub, Berlin
- Genre: Tech Meetup / Conference
- Style Preference: Modern Abstract Conceptual

## 2) Candidate Strategy / Prompt
**Initial flawed prompt:**
```text
A modern abstract conceptual poster for a tech meetup. Elegant overlapping geometric translucent shapes. Colors: deep midnight blue, plum, sandstone. Include the text "Future of AI in Design" in a modern font.
```

**Recovery strategy summary:**
- Metaphor: clean intersecting geometric plane
- Typography: Method B with `litellm/ideogram-v4`
- Constraint: text isolated in clean high-contrast field

**Corrected prompt:**
```text
A contemporary abstract conceptual art poster plate with strict hierarchy. The top half is clean, solid warm sandstone color and functions as text-safe negative space. In the center of this clean field, perfectly legible typography reads exactly "Future of AI in Design" in a bold modern sans-serif in deep midnight blue. The bottom half contains restrained overlapping geometric shapes in deep midnight blue and muted plum. Matte paper texture, zero glow, zero gradients, no photorealism, no 3D, zero neon. Aspect ratio 2:3.
```

## 3) Critique Mapping
| Check | Reference | Result |
|---|---|---|
| Hallucinated glyphs | `STANDARDS.md` §1.1 | Fail on initial candidate; pass on corrected |
| Hierarchy order | `STANDARDS.md` §2.1 | Fail on initial candidate (text competes with background); pass on corrected |
| Method B constraints | `STANDARDS.md` §3.1 | Fail on initial candidate; pass on corrected |
| Legibility/contrast | `STANDARDS.md` §3.3 | Fail on initial candidate; pass on corrected |
| Palette control | `STANDARDS.md` §5.1 | Fail on initial candidate; pass on corrected constrained palette |

## 4) Final Result
Failure at Stage 5 was resolved by routing to `litellm/ideogram-v4` and forcing a clean text zone.

## 5) Lesson Captured
For Method B, model selection and text placement are both mandatory controls: even strong models fail when text is layered onto busy geometry.

## 6) Technical Manifest
- Model: `litellm/ideogram-v4`
- Size/aspect: `2:3` portrait
- Seed: N/A
- Output format: `png`
