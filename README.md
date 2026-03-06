# OpenClaw Puter AI Plugin

![npm](https://img.shields.io/npm/v/@fw_dxs/openclaw-puter-ai)
![license](https://img.shields.io/npm/l/@fw_dxs/openclaw-puter-ai)

An advanced AI assistant plugin for **OpenClaw**, powered by **Puter AI** with dynamic model routing, autonomous tools, and image generation.

This plugin adds a powerful AI agent to OpenClaw capable of chat, coding assistance, web search, and image generation.

---

# Features

- GPT-5.3 chat support
- GPT-5.3 Codex routing for coding tasks
- Autonomous AI agent with tool calling
- Web search integration
- Code generation assistance
- AI image generation
- Conversation memory
- Streaming responses
- Automatic Puter authentication
- Token caching (no repeated login)

---

# Commands

## Chat

```
/ai <prompt>
```

Example:

```
/ai explain how transformers work
```

---

## Memory Chat

Stores conversation history for the user.

```
/ai chat <prompt>
```

Example:

```
/ai chat remember my project name is Atlas
```

---

## Code Generation

Automatically routes to **GPT-5.3 Codex** for coding tasks.

```
/ai code build a nodejs api
```

---

## Web Search

```
/ai search latest AI models
```

---

## Image Generation

```
/ai image futuristic city at sunset
```

Images are generated using Puter and saved locally.

---

## Autonomous Agent

The agent can automatically decide which tools to use.

```
/ai research how to build a discord bot
```

The AI may automatically:

- search the web
- generate code
- create images
- answer directly

---

# Installation

Install the plugin via npm:

```
npm install @fw_dxs/openclaw-puter-ai
```

Then enable it in your OpenClaw configuration.

---

# Requirements

- Node.js 18+
- OpenClaw
- Puter account (for AI access)

The plugin will automatically prompt for Puter authentication on first use.

---

# Model Routing

The plugin automatically selects models depending on the task.

| Task | Model |
|------|------|
| General chat | GPT-5.3 Chat |
| Coding tasks | GPT-5.3 Codex |
| Image generation | GPT Image |

---

# Project Structure

```
openclaw-puter-ai
│
├── index.js
├── agent.js
├── puterClient.js
├── openclaw.plugin.json
├── README.md
│
├── tools
│   ├── webSearch.js
│   └── codeGen.js
│
├── memory
│   └── conversation.js
│
└── generated
```

---

# Security Notes

Do **not publish or share** these files:

```
.puter-token.json
memory.json
generated/
```

These files contain local runtime data.

---

# License

MIT License

---

# Author

fw_dxs

---

# Future Improvements

Planned features include:

- filesystem tools for autonomous development agents
- code execution tools
- multi-image generation
- improved OpenClaw UI integration