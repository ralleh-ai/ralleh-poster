# Poster Generation Workflow

**Version**: 2.0  
**Authority**: Execution framework for the Ralleh Poster skill.  
**Constraint**: Any LLM or agent operating this repository must execute these seven stages sequentially. Do not skip stages. Do not begin generation until Stage 3 is complete. Every stage contains mandatory exit gates that must be satisfied before advancing.

This workflow is designed to prevent generic "AI slop" by forcing the agent to think like a professional designer: gathering context, establishing creative limits, drafting concepts, critiquing ruthlessly, and executing deliberately.

---

## Stage 1: Intake (Context Gathering)

Do not make assumptions about event details. Gather raw metadata and establish creative constraints.

### 1.1 Checklist
- [ ] **Event Title**: Exact capitalization, spelling, and punctuation.
- [ ] **Date/Time**: Correct format (e.g., Day of week, Month Day, Year, start/end time).
- [ ] **Venue**: Full name, address, and city (or virtual platform).
- [ ] **Billing / Performers**: Order of importance, secondary names, and sponsors.
- [ ] **Genre / Event Type**: Categorize (e.g., Music, Theater, Market, Sports).
- [ ] **Reference Images**: Ask the user if they have reference images or mood boards they wish to upload (e.g., brand guidelines, past posters). Ensure they are ingested into context if provided.
- [ ] **Style Constraints**: Identify requested style (map to `TEMPLATES.md` if possible) and explicitly note forbidden tropes per `STANDARDS.md` §4.
- [ ] **Format / Specs**: Intended output medium (Digital/Print, aspect ratio).

### 1.2 Exit Gate
Proceed to Stage 2 only when the Event Title, Date, Venue, and Genre are confirmed by the requester. **If operating in a conversational web UI, stop and ask the user for this information now. Do not proceed until they reply.**

---

## Stage 2: Research (Visual Context)

Root the poster in authentic artistic reference points before drafting concepts.

### 2.1 Action Steps
1. Use web search or internal memory to investigate the visual history of the performer/artist or the event's genre.
2. Investigate the physical venue or the geographic location for architectural or regional aesthetic hooks.
3. Identify relevant art movements or analog printing traditions (e.g., 1960s Fillmore screenprints, Bauhaus, Risograph, Swiss Grid).

### 2.2 Output
Write a short, text-based "Mood Board" (3-5 bullet points) summarizing recurring colors, visual motifs, and textures that fit the event and comply with `STANDARDS.md`.

### 2.3 Exit Gate
Proceed to Stage 3 only when the Mood Board is documented in the session context. **If in a conversational UI, present the Mood Board to the user for approval before continuing.**

---

## Stage 3: Design Strategy (Creative Limits)

Synthesize research into a strict design direction. This is where the poster is intellectually solved before any pixels are generated.

### 3.1 Key Decisions
- **The Core Metaphor**: What singular symbolic element represents the entire event? (Choose one striking icon, abstract shape, or scene. Never depict everything.)
- **The Style Preset**: Select the most appropriate layout template from `TEMPLATES.md` (or define a custom one that adheres strictly to `STANDARDS.md`).
- **The Color Palette**: Select exactly 3-4 specific named colors (e.g., "Warm Ochre #C28832, Midnight Navy #142035, Off-White Cream #F5EFE0"). Consult `STANDARDS.md` §5.
- **Typography Strategy**: Choose Method A (Textless Plate) or Method B (High-Fidelity Short Header) per `STANDARDS.md` §3.1. Decide where text will reside and how legibility will be maintained (e.g., backing panels, negative space).
- **Format Target**: Finalize resolution/aspect ratio.

### 3.2 Output
A concise paragraph summarizing the strategy, naming the metaphor, the `TEMPLATES.md` reference, the 3-4 colors, and the typography plan.

### 3.3 Exit Gate
Proceed to Stage 4 only when the strategy paragraph is written and explicitly confirms compliance with `STANDARDS.md` color and typography rules. **In a conversational UI, present the strategy to the user for alignment before generating concepts.**

---

## Stage 4: Concept Generation (Drafting)

Develop multiple distinct creative angles based on the approved strategy.

### 4.1 Action Steps
Draft **4 distinct visual concepts** (or user-requested number). Each concept must include:
- **Title**: A short evocative name for the concept.
- **Visual Metaphor**: What the plate depicts.
- **Composition**: How elements are structured (referencing `STANDARDS.md` §6 frameworks).
- **Prompt Concept**: The exact text description to be sent to the visual model, incorporating the relevant `TEMPLATES.md` prompt block and slop-prevention keywords.
- **Rationale**: A one-sentence explanation of why this concept fits the event and avoids genre tropes (`STANDARDS.md` §4).

### 4.2 Constraints
Ensure concepts are truly distinct structural approaches, not minor variations of the same idea. Every concept must be designed to pass the anti-slop criteria (`STANDARDS.md` §1).

### 4.3 Exit Gate
Proceed to Stage 5 only when all 4 concepts are documented. Present the concepts to the requester for selection. **If operating in a conversational UI, stop here. Ask the user which concept they prefer. Do not proceed to critique or generation until the user has selected a path.** (Unless an automated `--generate` flag is set).

---

## Stage 5: Critique (Objective Scoring)

Evaluate the drafted concepts (or the initial generated candidates if running autonomously) against professional design criteria.

### 5.1 Scoring Rubric (Pass/Fail for each)
1. **Slop Prevention (`STANDARDS.md` §1)**: Is it free of plastic rendering, volumetric overload, cluttered noise, and hallucinated glyphs? Does it exhibit analog tactile quality?
2. **Hierarchy (`STANDARDS.md` §2)**: Is the Hook clearly dominant? Does the eye know where to go next?
3. **Typography (`STANDARDS.md` §3)**: Is there a clear, uncluttered zone for text integration? (Or, if Method B is used, is the header perfectly rendered?)
4. **Color & Composition (`STANDARDS.md` §§5-6)**: Are there only 3-4 colors? Is there at least 30% negative space? Is the main visual anchored?

### 5.2 Action
Filter out any concept or generated candidate that fails *any* of the four criteria. Select the strongest passing concept.

*   **Calibration Hint**: If you are unsure whether a candidate passes the anti-slop rules, consult the reference cases in `examples/`. Compare your candidate against the failure patterns shown in `example-02` and `example-05`. If your candidate resembles the failures, reject it and refine the prompt.

### 5.3 Exit Gate
Proceed to Stage 6 only when a single concept has passed the critique rubric and is selected for final execution.

---

## Stage 6: Refinement (Generation & Iteration)

Execute the selected concept and iterate until the output is flawless.

### 6.1 Action Steps
1. **Model Selection**: If the strategy uses Method B (Direct Text), explicitly route the request to a typography-capable model (prefer `ideogram/v2`). If Method A (Textless), use a high-fidelity texture model (prefer `flux-pro`).
2. Execute the image generation using the prompt developed in Stage 4.
3. Review the resulting plate using vision capabilities (or self-critique).
4. Check against the Stage 5 rubric. If the image model introduced slop, hallucinated text, or ignored color constraints, *reject the plate*.
5. Adjust the prompt (e.g., increase weights on anti-slop terms, simplify the metaphor, enforce "textless plate") and regenerate.
6. Repeat until a plate passes the critique rubric completely.

### 6.2 Exit Gate
Proceed to Stage 7 only when a generated plate passes the vision-critique for slop, hierarchy, typography space, and color constraints. Never advance a flawed plate. *(Note: If you are a web LLM without native image generation, your exit gate is providing the final refined prompt to the user and asking them to run it).*

---

## Stage 7: Final Output (Delivery & Archiving)

Deliver the final poster and document the design rationale.

### 7.1 Deliverables
1. **The Poster Asset**: The high-quality image file (in the requested format/resolution).
2. **Design Rationale**: A short summary explaining the metaphorical choices, typography plan, color selections, and how it avoids slop.
3. **Technical Manifest**: The exact provider/model used, seed (if applicable), and final generation prompt for reproducibility.

### 7.2 File Storage
Save the outputs to the project directory according to the structure defined in `TOOLS.md` §3. Ensure the event slug naming convention is followed.

### 7.3 Exit Gate
The workflow is complete when the deliverables are presented to the requester and all files are saved to the defined directory structure.
