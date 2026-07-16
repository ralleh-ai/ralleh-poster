# Poster Generation Workflow

This document details the step-by-step procedure required to generate high-quality, non-slop performance or event posters. Any LLM or agent operating in this repository must follow this sequence systematically.

## Stage 1: Intake

Before starting, establish exact context. Do not make assumptions about event details.
* **Objective**: Gather raw metadata and constraints.
* **Checklist**:
  - [ ] **Event Title**: Exact capitalization, spelling, and punctuation.
  - [ ] **Date/Time**: Correct format (e.g., Day of week, Month Day, Year, start/end time).
  - [ ] **Venue**: Full name, address, and city (or virtual platform if applicable).
  - [ ] **Billing / Performers**: Order of importance, secondary names, and sponsors.
  - [ ] **Style Constraints**: Prefer minimal/handcrafted aesthetics. Note explicitly forbidden generic trends.
  - [ ] **Technical Specs**: Intended output medium (Digital: 1080x1920 or Print: 300 DPI, standard paper sizes).

---

## Stage 2: Research

Investigate visual contexts corresponding to the event, performer, or setting.
* **Objective**: Root the poster in authentic artistic reference points.
* **Action Steps**:
  1. Search for the performer/artist’s historical design language, previous album art, or concert posters.
  2. Research the physical venue: its architectural style, geographic location, history, or prevailing local aesthetics.
  3. Look for broader regional art trends connected to the genre of the performance.
  4. Build a brief text-based "Mood Board" containing recurring colors, visual motifs, and textures.

---

## Stage 3: Design Strategy

Synthesize research into a concise design direction before generating images.
* **Objective**: Define the core visual metaphor.
* **Key Decisions**:
  - **The Metaphor**: What singular symbolic element represents the entire event? (Avoid depicting everything; choose one striking icon, abstract shape, or scene).
  - **The Style**: Choose a layout template (e.g., Swiss Design, Vintage Concert Screenprint, Linocut, Risograph).
  - **The Palette**: Select 3-4 specific colors (e.g., "Warm Ochre, Muted Sage, Off-White, and Midnight Black").
  - **Typography Layout Strategy**: Plan where text will reside (top-heavy, bottom banner, wrapped around center metaphor) and how legibility will be maintained.

---

## Stage 4: Concept Generation

Develop multiple distinct creative angles.
* **Objective**: Present diverse possibilities before committing.
* **Action Steps**:
  - Draft **4 to 6 distinct visual concepts**.
  - Each concept must include:
    - **Visual Metaphor**: What we see.
    - **Layout/Composition**: How elements are structured.
    - **Prompt Concept**: Detailed description for a visual model.
    - **Inspiration**: e.g., "Inspired by 1970s jazz festival prints."
  - Ensure concepts are truly distinct, not just minor iterations of each other.

---

## Stage 5: Critique

Evaluate all concepts objectively against professional design criteria.
* **Objective**: Filter out low-effort or visually cluttered designs.
* **Scoring Rubric (1-5 for each)**:
  1. **Visual Hierarchy**: Does the viewer's eye move logically from the Title, to the Metaphor, to the Date and Venue?
  2. **Typography Integration**: Is there a clear, uncluttered space for readable text, or does it clash with the background art?
  3. **Composition & Balance**: Does it make effective use of empty space (negative space)?
  4. **Originality / Anti-Slop**: Is it free of generic glossy gradients, plastic-like lighting, over-rendered curves, and cliché AI elements?
* **Action**: Choose the top 1 or 2 concepts for Refinement.

---

## Stage 6: Refinement

Iterate on the selected concepts.
* **Objective**: Tighten visual details and prepare for generation.
* **Action Steps**:
  - Incorporate critiques from Stage 5 or explicit user feedback.
  - Refine prompting parameters (e.g., specify camera angle, film grain, paper texture, printing technique).
  - Test variations of the prompt to ensure predictable layout results.

---

## Stage 7: Final Output

Run final execution and provide clear context.
* **Objective**: Produce the final poster and document the design rationale.
* **Deliverables**:
  1. **High-Quality Poster Asset**: Delivered in the requested size/aspect ratio.
  2. **Design Rationale**: Brief text explaining the metaphorical choices, typography plan, and color selections.
  3. **Technical Manifest**: The exact models used, seed (if applicable), and final prompts for future reproducibility.
