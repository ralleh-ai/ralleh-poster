# Example 06: Theater Conceptual — "Macbeth"

**Status**: ✅ Approved. Passes all `STANDARDS.md` criteria.

## 1. Event Brief
*   **Title**: Macbeth
*   **Date/Time**: October 12 – 30, 2026
*   **Venue**: The Royal Garrison Theatre
*   **Genre**: Theater / Performing Arts
*   **Style Preference**: Woodcut / Linocut (Physical Relief Print)

## 2. Design Strategy (Stage 3 Output)
Theater posters often fall into literal traps (swords, crowns, blood spatters). This strategy subverts those tropes by using a conceptual, non-literal metaphor rendered in a brutal, tactile style suitable for a tragedy.

*   **Metaphor**: A dark, dense thicket of twisted thorns intertwining to subtly form the shape of a hollow crown. 
*   **Style**: Bold Woodcut / Linocut (Relief Print).
*   **Palette**: Charcoal Black `#111111`, Sandstone White `#E8E5DF`, and a single accent of Dried Blood Red `#8B2620`.
*   **Typography Strategy**: Method A (Textless Plate). The heavy woodcut aesthetic is too complex for an image model to cleanly integrate text. Type will be placed post-generation in the lower third.

## 3. Final Prompt Used (Stage 6)
```text
A bold woodblock print poster plate, traditional relief linocut style. Thick physical ink textures, visible chiseled wood carving marks, and heavy textured paper embossing. The visual shows a dense thicket of twisted thorns intertwining to subtly form the shape of a hollow crown, carved in strong positive and negative space. High-contrast duotone style using deep charcoal black ink on natural sandstone white mulberry paper, with a single heavy ink stain of dried blood red in the center. The bottom third is uncarved sandstone white negative space. Raw, tactile, organic, no digital lines, no photorealism, no 3D elements, textless plate.
```

## 4. Design Rationale
The relief print style instantly communicates gravity and historical weight without feeling like digital art. By asking the model to form the crown out of thorns (a conceptual leap rather than a literal drawing of a gold crown), the poster becomes an art piece. The color palette is ruthlessly restricted to three colors, achieving the required duotone-plus-accent harmony.

## 5. `STANDARDS.md` Compliance Mapping
| Rule | Compliance |
|---|---|
| §1.1 Slop indicators | ✅ Zero photorealism, zero CGI. Looks physically carved. |
| §2.1 Hierarchy | ✅ The twisted crown commands 60% of visual attention (Hook). |
| §3.1 Typography | ✅ Method A (Textless) prevents the complex woodgrain from distorting text. |
| §4.2 Genre tropes | ✅ Avoids literal stage curtains, tragedy masks, and standard shiny swords. |
| §5.2 Color Harmony | ✅ High-contrast duotone with one deep, thematic accent color. |
| §6.2 Negative space | ✅ The uncarved bottom third provides rest space and future text housing. |

## 6. Technical Manifest
*   **Model**: `fal/flux-pro` (exceptional at capturing the physical chisel marks and paper embossing)
*   **Size**: `2480 x 3508 px` (A4 Print)
*   **Seed**: `33910`
*   **Final Output**: Textless plate delivered for vector overlay.
