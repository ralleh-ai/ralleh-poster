# Examples Directory

This directory contains few-shot calibration material for the Ralleh Poster workflow.

By reviewing these examples, AI agents and human designers can calibrate their understanding of what constitutes a successful poster under the strict `STANDARDS.md` framework, and what constitutes a failure (AI slop).

## How to Use These Examples
*   **LLMs/Agents**: When evaluating drafted concepts or inspecting generated images during **Stage 5 (Critique)**, compare your candidate against these examples. If your candidate resembles the failures in `example-02` or `example-05`, you must reject it and refine the prompt. Read specific examples if you are uncertain about applying the `STANDARDS.md` rubrics.
*   **Designers**: Review these cases to understand how the 7-stage workflow translates raw event data into professional, tactile graphic design.

## Available Cases
*   `example-01-success-minimalist.md` — Perfect execution of the Swiss Minimalist template (Textless Plate).
*   `example-02-failure-slop.md` — Failure mode: volumetric overload and aesthetic clutter, and how to recover.
*   `example-03-end-to-end.md` — An end-to-end transcript of the 7-stage workflow showing decisions at each gate.
*   `example-04-success-vintage-screenprint.md` — Strong vintage aesthetic for live music, subverting tropes.
*   `example-05-failure-typography.md` — Failure mode: illegible typography and bad hierarchy using direct text rendering.
*   `example-06-success-theater-conceptual.md` — A conceptual theater poster using non-literal metaphors.

## Adding New Examples
To add a new example:
1. Copy an existing file (e.g., `example-01`).
2. Follow the naming convention: `example-XX-<success|failure>-<theme>.md`.
3. Include the event brief, style, strategy, exact prompt, and a clear compliance mapping to `STANDARDS.md`.
4. Add a link to your new file in the "Available Cases" list above.
