# Installation & Usage in OpenClaw

This guide describes how to configure, load, and run the `ralleh-poster` skill in your local or server-side OpenClaw gateway environment.

---

## 1. Prerequisites
Before installing this skill, ensure your OpenClaw runtime meets the following:
*   OpenClaw Gateway `v0.x` or later.
*   An enabled agent (e.g., `ralleh`) with the necessary capability profile.
*   Available image generation providers (e.g., `fal`, `openai`, or `ideogram`) configured with API keys in your gateway secrets.
*   Vision analysis capability enabled for the `image` tool.

---

## 2. Skill Integration

OpenClaw discovers skills dynamically from the filesystem. To load this skill, ensure the directory containing `SKILL.md` is exposed to your agent's skill discovery path.

### Step 1: Clone the Repository
Clone the repository to a stable path on your gateway host:
```bash
git clone https://github.com/ralleh-ai/ralleh-poster.git /opt/skills/ralleh-poster
```

### Step 2: Register the Skill Path
Update your OpenClaw gateway configuration (usually `~/.openclaw/openclaw.json` on user installs or `/etc/openclaw/gateway.json` on server installs) so that the skills discovery mechanism includes the new path:

```json
{
  "skills": {
    "paths": [
      "/opt/skills/ralleh-poster"
    ]
  }
}
```

### Step 3: Reload the Gateway
Reload the OpenClaw gateway to apply changes:
```bash
openclaw gateway restart
```

### Step 4: Verify Loading
Confirm the skill loaded successfully:
```bash
openclaw skills list | grep ralleh-poster
```

If the skill does not appear, check the gateway logs for a load error:
```bash
openclaw gateway logs --tail
```

---

## 3. Recommended Agent Configuration

For premium output quality, configure the designated agent (e.g., `ralleh` or a specialized creative sub-agent) with a tool profile and model mapping optimized for visual composition and vision feedback.

### Key Configuration Overrides
Modify your agent block in `openclaw.json` to include the following overrides:
```json
{
  "agents": {
    "ralleh-poster": {
      "model": "litellm/premium",
      "default_model": "litellm/default",
      "tool_profile": "creative",
      "capabilities": [
        "image_generate",
        "image",
        "web_search",
        "web_fetch",
        "read",
        "write",
        "edit",
        "exec"
      ],
      "model_routing": {
        "textless_plates": "fal/flux-pro",
        "text_integrated": "ideogram/v2"
      }
    }
  }
}
```

**Notes:**
*   `tool_profile: "creative"` unlocks image generation and vision tools by default.
*   `model_routing` is a suggested extension: use it to hint to the agent when to switch between FLUX and Ideogram based on Stage 6 requirements.

---

## 4. Invocation Methods

There are two primary ways to run the skill inside OpenClaw.

### Method A: Direct User Invocation
A user triggers the skill by providing event info and asking for a poster. OpenClaw routes the request directly to the agent holding this skill.

**Example Command (Chat):**
> "Hey Ralleh, I need a poster for the Copenhagen Chamber Recital on October 25th at 8 PM at Sylvan Hall. Let's make it Swiss Minimalist style."

### Method B: Cross-Agent Delegation (Sub-Agent Mode)
An executive or marketing agent can spawn a specialized child sub-agent to handle poster creation autonomously.

**Example Sub-Agent Spawn Pattern:**
```json
{
  "action": "sessions_spawn",
  "task": "Generate a Swiss Minimalist poster plate for the October 25 Copenhagen Recital. Use the ralleh-poster skill framework at /opt/skills/ralleh-poster.",
  "taskName": "generate_recital_poster",
  "cleanup": "keep"
}
```

### Method C: Reference from Another Agent (Prompt Directive)
If a non-owner agent needs to leverage the skill without spawning a sub-agent, it can reference the skill directives in a system prompt:

```markdown
When generating any poster or event visual, you MUST first read and follow the entire framework at `/opt/skills/ralleh-poster/`, starting with `LLM_BOOTSTRAP.md`. Do not use your default image-generation prompt style; the Ralleh Poster anti-slop rules override your defaults for poster tasks.
```

Once complete, the invoked agent saves the finalized outputs to `output/` per `TOOLS.md` §3, and returns the design rationale and local file path to the parent session.

---

## 5. Troubleshooting

| Issue | Fix |
|---|---|
| Skill not appearing in `openclaw skills list` | Confirm the `skills.paths` array includes the parent directory of the skill and restart the gateway. |
| Agent doesn't use FLUX/Ideogram routing | Ensure the agent's model routing keys are set and API keys are configured under provider settings. |
| Image generation fails | Confirm the `image_generate` tool is in the agent's `capabilities` array and provider secrets exist. |
| Vision critique step blocked | Ensure `image` (vision analysis) capability is enabled in your agent's tool profile. |
