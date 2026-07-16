---
name: ralleh-poster
description: "Generate high quality, unique, non-slop performance/event posters."
---

# Ralleh Poster

Use when creating professional-grade, unique posters for company performances or events.

This skill emphasizes visual consistency, high-resolution output, and avoids generic AI-generated "poster slop" by leveraging specific artistic style guidelines and iterative prompt refinement.

## Inputs

Required:

- Event Title
- Event Date/Time
- Venue
- Key Visual Elements or Theme

Optional:

- `--model <provider/model>` (default: latest professional art-capable model)
- `--style <minimalist|vintage|bold-typography|abstract>`
- `--resolution <size>` (default: 1080x1920 for digital, 2480x3508 for print)
- `--generate` to execute generation.

## Workflow

1. Gather Event details: Title, Date, Venue, Theme/Audience.
2. Draft 3 distinct visual concepts based on the requested Style.
3. Once approved, generate the Poster.
4. Save source prompts and generated assets to project storage.

## Safety

- Avoid generic "AI-aesthetic" tropes; aim for deliberate design choices.
- Respect brand identity (RALLEH design language).
- Verify all event information against provided project context before generation.
