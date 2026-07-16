# Adding Ideogram.ai to OpenClaw

OpenClaw does not currently ship with a native `ideogram` provider plugin out of the box. However, because OpenClaw integrates natively with **LiteLLM**, we can easily route Ideogram image generation requests through your existing LiteLLM proxy.

This allows the `image_generate` tool to call `litellm/ideogram-v2` seamlessly.

---

## 1. Update LiteLLM Configuration

Edit your LiteLLM configuration file (typically `/opt/ralleh/litellm/litellm_config.yaml`). 

Add the Ideogram model to your `model_list`:

```yaml
  - model_name: ideogram-v2
    litellm_params:
      model: ideogram/V-2
      api_key: os.environ/IDEOGRAM_API_KEY
```
*(Check LiteLLM documentation for the exact Ideogram model string if V-2a or V-2-turbo is preferred).*

## 2. Set the API Key

Ensure the `IDEOGRAM_API_KEY` is exported in the environment where LiteLLM runs. If LiteLLM is running as a systemd service, add it to your environment file (e.g., `/etc/default/litellm` or `/opt/ralleh/litellm/.env`):

```bash
IDEOGRAM_API_KEY="your-ideogram-api-key-here"
```

Restart the LiteLLM service:
```bash
sudo systemctl restart litellm
```

## 3. Configure OpenClaw Agent Routing

Now that LiteLLM is exposing `ideogram-v2` as an OpenAI-compatible endpoint, update your OpenClaw agent configuration to prioritize it for poster typography.

Edit `~/.openclaw/openclaw.json` (or `/etc/openclaw/gateway.json`):

```json
{
  "agents": {
    "ralleh-poster": {
      "model_routing": {
        "textless_plates": "fal/flux-pro",
        "text_integrated": "litellm/ideogram-v2"
      }
    }
  }
}
```

## 4. Test the Integration

Invoke the image generation tool manually through the chat to verify the pipeline:

```text
/tool image_generate action="generate" model="litellm/ideogram-v2" prompt="A simple test poster with the word 'HELLO' in bold sans-serif font on a white background."
```
