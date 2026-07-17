# Installation & Usage in OpenClaw

This guide describes how to configure, load, and run the `ralleh-poster` skill in a current OpenClaw environment.

---

## 1. Prerequisites
Before installing this skill, ensure your OpenClaw runtime meets the following:
*   OpenClaw Gateway `v0.x` or later.
*   An enabled agent (e.g., `ralleh`) with the necessary capability profile.
*   Available image generation providers (e.g., `fal`, `openai`, or `ideogram`) configured with API keys in your gateway secrets.
*   Vision analysis capability enabled for the `image` tool.

---

## 2. Skill Integration

OpenClaw loads skills from standard roots (workspace/user managed paths). Recommended approach: install the skill into the active workspace using native CLI.

### Step 1: Install into workspace
```bash
openclaw skills install git:ralleh-ai/ralleh-poster
```

### Step 2: Verify loading
```bash
openclaw skills list | grep ralleh-poster
openclaw skills check
```

### Step 3: If using custom directories
Use `skills.load.extraDirs` in `~/.openclaw/openclaw.json`:

```json
{
  "skills": {
    "load": {
      "extraDirs": ["/opt/skills"]
    }
  }
}
```

Then restart gateway or open a new session:
```bash
openclaw gateway restart
```

---

## 3. Recommended Agent Configuration

For premium output quality, configure the designated agent (e.g., `ralleh` or a specialized creative sub-agent) with a tool profile and model mapping optimized for visual composition and vision feedback.

### Key Configuration Overrides
Use agent allowlists and image model defaults in `openclaw.json`:

```json
{
  "agents": {
    "defaults": {
      "skills": ["ralleh-poster"],
      "imageGenerationModel": {
        "primary": "fal/flux-pro"
      }
    }
  },
  "skills": {
    "entries": {
      "ralleh-poster": {
        "enabled": true
      }
    }
  }
}
```

**Notes:**
- Keep `image_generate`, `image`, `web_search`, `web_fetch`, `read`, `write`, and `edit` available in the runtime tool profile.
- Prefer textless plate flows on `fal/flux-pro`; use `litellm/ideogram-v4` when Method B is required.

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
| Skill not appearing in `openclaw skills list` | Run `openclaw skills check`; verify install location and agent allowlists. |
| Skill present but not visible to this agent | Check `agents.defaults.skills` / `agents.list[].skills` configuration. |
| Image generation fails | Verify provider auth and `agents.defaults.imageGenerationModel` settings. |
| Vision critique step blocked | Ensure the `image` tool is available in runtime and not restricted by profile. |
