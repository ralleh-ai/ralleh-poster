---
name: ralleh-poster
description: "Generate premium, non-slop event and performance posters through a strict 7-stage design workflow, governed by anti-slop design standards and reusable style templates."
version: 2.0
tool_profile: creative
default_model: latest professional image-generation model available in runtime
authority_files:
  - STANDARDS.md   # Binding design law (anti-slop, hierarchy, typography, color, composition, genre)
  - TEMPLATES.md   # Reusable style presets with copy-ready prompt blocks
  - WORKFLOW.md    # 7-stage procedural loop the agent must execute
  - TOOLS.md       # Runtime tool contract and output file layout
---

# Ralleh Poster — Skill Definition

Use this skill any time a user asks for a poster, flyer, gig print, event graphic, or promotional visual for a performance, cultural event, market, festival, exhibition, community gathering, or athletic event.

Do **not** use this skill for: logos, brand identity systems, product marketing collateral, editorial illustration, or generic social-media graphics that are not event-anchored.

---

## 1. Purpose

Produce event posters that a trained designer could not identify as AI-generated. The skill enforces analog artistic constraints, restricted palettes, deliberate typography, and slop-free composition through a mandatory 7-stage process.

Generic image-model output is not acceptable. This skill exists specifically to defeat the default AI aesthetic.

---

## 2. When to Invoke

Invoke Ralleh Poster when **any** of the following is true:

*   The user asks for a poster, gig poster, event flyer, concert print, festival graphic, theater bill, market poster, or similar event visual.
*   The user references a specific dated event with a title, performer, venue, or theme.
*   The user asks to "make a poster in the style of [artist / era / movement]".

Do **not** invoke for:

*   Requests for a raw image with no event context (use direct image generation).
*   Requests for evergreen brand assets, logos, or icons.
*   Requests for editorial art with no functional communication requirement.

---

## 3. Required Inputs

Before beginning generation, the following must be gathered from the requester. If any required field is missing, ask exactly one focused clarification question per turn until all are captured.

| Field | Required | Notes |
|---|---|---|
| Event Title | ✅ | Exact spelling, capitalization, punctuation |
| Date & Time | ✅ | Day of week, month, day, year, start–end times |
| Venue | ✅ | Full venue name, address or city, or virtual platform |
| Genre / Event Type | ✅ | Music, theater, community, food/market, sports, cultural |
| Performers / Billing | Recommended | Headliner + supporting acts in order of billing |
| Style Preference | Optional | Reference a `TEMPLATES.md` preset or free-text direction |
| Output Format | Optional | Digital / Print / Both (defaults per `TOOLS.md`) |
| Sponsor / Ticket URL | Optional | Placed only as Tier-4 footnote per `STANDARDS.md` §2 |

---

## 4. Optional Skill Flags

The user may supply any of these flags to override defaults:

| Flag | Purpose | Values |
|---|---|---|
| `--style` | Force a specific template from `TEMPLATES.md` | `swiss-minimalist`, `vintage-screenprint`, `woodcut-linocut`, `abstract-conceptual`, `retro-futurism` |
| `--model` | Override default image-generation model | Any provider/model available in runtime |
| `--format` | Output medium | `digital`, `print`, `both` |
| `--resolution` | Explicit dimensions | e.g. `1080x1920`, `2480x3508` |
| `--concepts` | Number of distinct concepts in Stage 4 | Integer 3–6 (default 4) |
| `--generate` | Skip concept approval and generate the top-scored plate immediately | Flag (default off) |

---

## 5. Non-Negotiable Directives

The following directives override any conflicting user request. If the user asks for something that violates them, negotiate rather than comply blindly.

1.  **Follow `WORKFLOW.md` in order.** Never skip a stage. Never generate an image before Stage 3 (Design Strategy) is complete.
2.  **Obey `STANDARDS.md` absolutely.** Every plate must pass the anti-slop criteria in §1, the hierarchy rules in §2, and the color and composition rules in §5 and §6 before delivery.
3.  **Prefer textless plates.** Follow `STANDARDS.md` §3.1 Method A unless the requester explicitly asks for baked-in typography and the plate can pass Method B verification.
4.  **Restrict the palette.** Maximum 4 named colors per poster including canvas tone.
5.  **Preserve provenance.** Save prompt, seed, model, and design rationale for every final plate per `TOOLS.md` §3.
6.  **Do not fabricate event facts.** Every title, date, performer, and venue must be sourced from the requester. Never invent event details to fill a template.
7.  **Verify legibility before delivery.** Run a vision-critique step per `TOOLS.md` §4 on every candidate plate before declaring it final.

---

## 6. Success Criteria

A poster delivery is considered successful only if all of the following are true:

*   ✅ All required inputs from §3 were captured accurately.
*   ✅ All seven stages of `WORKFLOW.md` were executed in order.
*   ✅ The final plate satisfies every rule in `STANDARDS.md` §§1–6.
*   ✅ The chosen style is either one of the presets in `TEMPLATES.md` or a documented hybrid citing the templates used.
*   ✅ The delivery includes the poster asset, a design rationale, and a technical manifest per `WORKFLOW.md` Stage 7.
*   ✅ A vision-critique step confirmed the plate is legible, hierarchy-correct, and slop-free.

---

## 7. Safety & Boundaries

*   Do not depict identifiable real individuals without confirmed authorization from the requester.
*   Do not incorporate copyrighted logos, trademarks, or third-party artwork unless the requester confirms rights.
*   Do not generate misleading event information (fake dates, false headliners, unauthorized sponsor marks).
*   Do not deliver a plate that fails the anti-slop criteria. If iteration cannot resolve slop within a reasonable budget, escalate to the requester with the specific failure mode rather than shipping substandard work.
*   Respect RALLEH brand rules where the event is a RALLEH-branded activity; defer to the user's brand guidance where provided.

---

## 8. Interoperability

This skill is designed to be invoked either:

*   **Directly** by a user asking for a poster.
*   **By another agent** as a delegated capability (e.g., the Marketing agent routing a campaign visual).

When invoked by another agent, treat the invoking agent as the requester for the purpose of §3 inputs, but preserve any downstream approval requirements from that agent's own workflow.
