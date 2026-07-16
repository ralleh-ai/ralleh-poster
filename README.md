# Ralleh Poster

Create beautiful, non-slop posters for performances and events.

---

## 🤖 Instructions for LLMs / AI Agents

If you are an LLM or AI agent tasked with creating a new poster and were pointed to this repository (`https://github.com/ralleh-ai/ralleh-poster`), follow the prompt below to initialize a local, step-by-step task runner to generate the poster.

### How to use this Repository
1. **Initialize Your Task Loop**: Read the contents of `WORKFLOW.md`, `TOOLS.md`, and `references/DESIGN_STANDARDS.md`.
2. **Execute the Workflow**: Run through Stages 1 through 7 sequentially. Do not skip stages.
3. **Save your Output**: Place concepts and final outputs in a dedicated directory under `output/` following the format outlined in `TOOLS.md`.

---

## 🚀 Starter Prompt for AI Agents
Copy and paste the prompt below to initialize your run:

```markdown
You are an expert poster designer. We are going to generate a high-quality, unique, non-slop performance/event poster.

I want to create a new poster. I have loaded the ralleh-poster repository rules.

To begin, initialize a local task/workflow loop using the following repository rules:
1. Load and follow the 7 steps in WORKFLOW.md (Intake, Research, Design Strategy, Concept Generation, Critique, Refinement, Final Output).
2. Adhere to the design rules in references/DESIGN_STANDARDS.md (Minimalism, physical print references, restricted palettes, and no AI slop).
3. Set up the file structure described in TOOLS.md to store drafts, rationale, and the final output.

Please acknowledge that you have read these files and start immediately with Stage 1 (Intake). Ask me for any missing details required for the Intake checklist.
```

---

## 📂 Directory Structure

- `SKILL.md` - OpenClaw Skill definition for agent routing.
- `WORKFLOW.md` - Comprehensive 7-stage design process.
- `TOOLS.md` - Standardized tool descriptions for runtime integration.
- `references/` - Design standards and style templates.
  - `DESIGN_STANDARDS.md` - Quality standards to prevent generic AI style tropes.
  - `STYLE_TEMPLATES.md` - Aesthetic templates for quick visual starting points.
- `scripts/` - Reserved for future automated generation or text overlay scripts.
