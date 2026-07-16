# Installation & Usage in OpenClaw

This guide describes how to configure, load, and run the `ralleh-poster` skill in your local or server-side OpenClaw gateway environment.

---

## 1. Skill Integration

OpenClaw discovers skills dynamically from the filesystem. To load this skill, ensure the directory containing `SKILL.md` is exposed in your system's skill directories path.

### Configuration
Update your global OpenClaw gateway configuration (usually `~/.openclaw/openclaw.json` or `/etc/openclaw/gateway.json` depending on your environment):

```json
{
  "skills": {
    "paths": [
      "/opt/ralleh/company-ai/ralleh-poster"
    ]
  }
}
```

Reload the OpenClaw gateway to apply changes:
```bash
openclaw gateway restart
```

Verify that the skill is loaded:
```bash
openclaw skills list
```

---

## 2. Recommended Agent Configuration

To get high-quality outputs, configure the designated agent (e.g., `ralleh` or a dedicated creative sub-agent) with a tool profile and model mapping optimized for creative visual composition and vision feedback.

### Key Configuration Overrides:
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
        "web_search"
      ]
    }
  }
}
```

---

## 3. Invocation Methods

There are two primary ways to run the skill inside OpenClaw.

### Method A: Direct User Invocation
A user triggers the skill by providing event info and asking for a poster. OpenClaw routes the request directly to the agent holding this skill.

**Example Command:**
> "Hey Ralleh, I need a poster for the Copenhagen Chamber Recital on October 25th at 8 PM at Sylvan Hall. Let's make it Swiss Minimalist style."

### Method B: Cross-Agent Delegation (Sub-Agent Mode)
An executive or marketing agent can spawn a specialized child sub-agent to handle poster creation autonomously using standard sub-agent mechanisms.

**Example API / Sub-agent Spawn Pattern:**
```json
{
  "action": "sessions_spawn",
  "task": "Generate a Swiss Minimalist poster plate for the October 25 Copenhagen Recital. Use the ralleh-poster skill framework.",
  "taskName": "generate_recital_poster",
  "cleanup": "keep"
}
```

Once complete, the sub-agent saves the finalized outputs to `output/` and returns the design rationale and local file path to the parent session.
