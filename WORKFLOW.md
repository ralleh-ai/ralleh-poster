# Poster Generation Workflow

**Version**: 2.1  
**Authority**: Execution framework for the Ralleh Poster skill.  
**Constraint**: Execute these seven stages sequentially. Do not skip stages. Do not begin final-quality generation until Stage 3 is complete. Every stage has mandatory exit gates.

This workflow prevents generic AI slop by forcing deliberate design decisions, fast preview validation, and strict quality gates.

---

## Stage 1: Intake (Minimal Context Gathering)

Start with minimal intake to avoid overwhelming the requester.

### 1.1 Required Core Facts (must confirm)
- [ ] **Event Title**: exact capitalization/spelling/punctuation.
- [ ] **Date/Time**: correct calendar/time format.
- [ ] **Venue / Location**: name + city (address optional initially).
- [ ] **Genre / Event Type**.

### 1.2 Optional (defer by default, collect progressively)
- [ ] Billing / performer order / sponsors
- [ ] Reference images / mood board
- [ ] Style constraints
- [ ] Format / final export specs

### 1.3 Exit Gate
Proceed to Stage 2 when the 4 core facts are confirmed.

---

## Stage 2: Research (Visual Context)

Root the poster in authentic references before drafting concepts.

### 2.1 Action Steps
1. Investigate visual history of performer/genre.
2. Investigate venue/geography for architectural hooks.
3. Identify relevant analog traditions (Fillmore, Bauhaus, Risograph, Swiss grid, etc.).

### 2.2 Output
A concise text mood board (3–5 bullets) covering motifs, texture, color tendencies.

### 2.3 Exit Gate
Proceed only when the mood board is documented and acknowledged.

---

## Stage 3: Design Strategy (Creative Limits)

Solve the poster intellectually before generation.

### 3.1 Key Decisions
- **Core Metaphor**: one dominant symbol/scene.
- **Style Preset**: pick from `TEMPLATES.md` (or custom compliant).
- **Color Palette**: exactly 3–4 colors per `STANDARDS.md` §5.
- **Typography Strategy**: Method A (textless plate + post-layout) or Method B (short baked-in header).
- **Format Target**: aspect ratio/resolution.
- **Preview Plan**: thumbnail-first defaults (4 comps, low-cost review mode, anti-slop geometry constraints).

### 3.2 Output
A concise strategy paragraph naming metaphor, template reference, palette, typography method, and preview plan.

### 3.3 Exit Gate
Proceed to Stage 4 only when strategy explicitly confirms compliance with color + typography rules.

---

## Stage 4: Concept Generation (Drafting)

Develop multiple distinct directions from approved strategy.

### 4.1 Action Steps
Draft **4 distinct concepts** (or user-requested count). Each concept must include:
- **Title**
- **Visual Metaphor**
- **Composition** (per `STANDARDS.md` §6)
- **Prompt Concept** (final-direction prompt intent)
- **Thumbnail Prompt Variant** (compact, fast review prompt)
- **Rationale**

### 4.2 Constraints
Concepts must be structurally distinct, not minor tweaks.

### 4.3 Exit Gate
Present concepts and require requester selection before critique/generation continues.

---

## Stage 5: Critique (Objective Scoring)

Evaluate selected concept and generated preview candidates.

### 5.1 Scoring Rubric (Pass/Fail)
1. **Slop Prevention** (`STANDARDS.md` §1)
2. **Hierarchy** (`STANDARDS.md` §2)
3. **Typography Readiness** (`STANDARDS.md` §3)
4. **Color & Composition** (`STANDARDS.md` §§5–6)

### 5.2 Action
Reject any candidate that fails any criterion. Keep strongest passing direction only.

### 5.3 Exit Gate
Proceed to Stage 6 only when a single direction passes rubric and is selected.

---

## Stage 6: Refinement (Generation & Iteration)

Two-phase execution is mandatory.

### 6.1 Action Steps
#### Phase A — Thumbnail Round (mandatory)
1. Generate low-cost preview comps (default 4) before any final render.
2. Apply anti-slop geometry constraints (especially for concert scenes):
   - stage fully visible/unobstructed,
   - crowd below stage sightline,
   - no foreground occlusion crossing performer zone,
   - preserve negative space for typography.
3. Critique previews with Stage 5 rubric; reject failures aggressively.
4. Present previews and require explicit winner selection.

#### Phase B — Final Render
5. Select model by method:
   - Method A: prefer `fal/flux-pro` (textless plate)
   - Method B: prefer `litellm/ideogram-v4` (short baked-in text)
6. Render from selected preview direction.
7. Re-check rubric; reject slop/hierarchy failures.
8. Iterate prompt and regenerate until full pass.

### 6.2 Exit Gate
Proceed to Stage 7 only when:
1. Thumbnail winner is explicitly selected,
2. Final render passes slop/hierarchy/typography-space/color checks,
3. Geometry constraints remain intact.

---

## Stage 7: Final Output (Delivery & Archiving)

Deliver and document reproducibly.

### 7.1 Deliverables
1. **Poster Asset**
2. **Design Rationale**
3. **Technical Manifest** (provider, model, prompt, seed if available, format/size)
4. **Preview Lineage** (preview count + selected candidate id)

### 7.2 File Storage
Save under `output/<event-slug>/` per `TOOLS.md` conventions.

### 7.3 Exit Gate
Complete when deliverables are presented and saved.
