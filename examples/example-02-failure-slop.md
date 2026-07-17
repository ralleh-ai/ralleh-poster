# Example 02: Slop Failure — Live Music Festival

- Outcome: Failure → Recovered
- Example Type: Negative
- Primary Stage Checkpoint: Stage 5
- Primary Rules Referenced: §1.1, §4.1, §5.1, §6.2

## 1) Event Brief
- Title: Riverside Sound Festival
- Date/Time: Saturday, July 18, 2026 · Gates 4:00 PM
- Venue: Riverside Park, Portland
- Genre: Live Music Festival
- Style Preference: Not specified (free direction)

## 2) Candidate Strategy / Prompt
**Initial flawed prompt:**
```text
Create a poster for Riverside Sound Festival at Riverside Park. Music festival vibe with band performing, colorful lights, exciting atmosphere.
```

**Recovery strategy summary:**
- Metaphor: abstract river silhouette instead of literal instruments
- Style: Vintage Screenprint
- Palette: Mustard `#D9A441`, Navy `#1F2E4C`, Terracotta `#B45939`, Cream `#F5EFE0`
- Typography: Method A textless plate

**Corrected prompt:**
```text
An authentic 1970s concert gig poster plate. Handcrafted silkscreen print style, textured Risograph overlay, visible ink bleed, subtle dot halftone patterns, and warm paper grain. A stylized flat-graphic river silhouette flowing diagonally through the composition, rendered in bold, flat layers with organic imperfections. Colors: warm mustard yellow, deep navy, and terracotta on a cream canvas background. Zero digital rendering, zero plastic gloss, textless plate. Aspect ratio 2:3 portrait.
```

## 3) Critique Mapping
| Check | Reference | Result |
|---|---|---|
| Slop indicators | `STANDARDS.md` §1.1 | Fail on initial candidate; pass on corrected |
| Live music trope filter | `STANDARDS.md` §4.1 | Fail on initial candidate; pass on corrected |
| Color budget | `STANDARDS.md` §5.1 | Fail on initial candidate; pass on corrected |
| Negative space | `STANDARDS.md` §6.2 | Fail on initial candidate; pass on corrected |

## 4) Final Result
Failure detected at Stage 5, then corrected through strategy reset and prompt rewrite; recovered candidate passed critique.

## 5) Lesson Captured
Under-constrained prompts produce slop. Enforce template anchor + named palette + anti-slop language before generation.

## 6) Technical Manifest
- Model: `fal/flux-pro`
- Size/aspect: `2:3` portrait
- Seed: N/A (initial), regenerated with controlled seed in execution
- Output format: `png`
