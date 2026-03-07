const ai = require("./puterClient");
const webSearch = require("./tools/webSearch");
const codeGen = require("./tools/codeGen");

function getToolSpecs() {
  return [
    {
      type: "function",
      function: {
        name: "web_search",
        description: "Search the internet for information.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string" }
          },
          required: ["query"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "generate_code",
        description: "Generate or fix code.",
        parameters: {
          type: "object",
          properties: {
            prompt: { type: "string" }
          },
          required: ["prompt"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "generate_image",
        description: "Generate an image from a prompt.",
        parameters: {
          type: "object",
          properties: {
            prompt: { type: "string" }
          },
          required: ["prompt"]
        }
      }
    }
  ];
}

function getToolCalls(resp) {
  return (
    resp?.choices?.[0]?.message?.tool_calls ||
    resp?.message?.tool_calls ||
    resp?.tool_calls ||
    []
  );
}

function getAssistantMessage(resp, toolCalls) {
  return (
    resp?.choices?.[0]?.message ||
    resp?.message || {
      role: "assistant",
      content: null,
      tool_calls: toolCalls
    }
  );
}

function getText(resp) {
  if (!resp) return "";

  const content =
    resp?.choices?.[0]?.message?.content ||
    resp?.message?.content ||
    resp?.text ||
    resp?.content ||
    null;

  if (typeof content === "string") return content;
  if (content == null) return "";

  return JSON.stringify(content, null, 2);
}

async function runToolCall(toolCall) {
  const fn = toolCall?.function?.name;
  let args = {};

  try {
    args = JSON.parse(toolCall?.function?.arguments || "{}");
  } catch (err) {
    console.error("[Agent] Failed parsing tool args:", err);
    args = {};
  }

  console.log("[Agent] Tool requested:", fn, args);

  if (fn === "web_search") {
    return String(await webSearch(args.query || ""));
  }

  if (fn === "generate_code") {
    return String(await codeGen(args.prompt || ""));
  }

  if (fn === "generate_image") {
    return String(await ai.image(args.prompt || ""));
  }

  return "Unknown tool";
}

function isImagePrompt(prompt) {
  const text = String(prompt || "").toLowerCase();
  return (
    text.includes("make an image") ||
    text.includes("generate an image") ||
    text.includes("create an image") ||
    text.includes("draw ") ||
    text.includes("illustration") ||
    text.includes("picture of") ||
    text.includes("image of")
  );
}

async function runAgent(prompt) {
  console.log("[Agent] Starting run");
  console.log("[Agent] Prompt:", prompt);

  if (isImagePrompt(prompt)) {
    console.log("[Agent] Direct image shortcut triggered");
    return await ai.image(prompt);
  }

  const toolSpecs = getToolSpecs();

  let messages = [
    {
      role: "system",
      content:
        "You are an autonomous AI assistant. Use web_search for current information, generate_code for coding tasks, and generate_image for image requests. If no tool is needed, answer directly."
    },
    {
      role: "user",
      content: prompt
    }
  ];

  const MAX_TOOL_ROUNDS = 5;

  for (let round = 1; round <= MAX_TOOL_ROUNDS; round++) {
    console.log(`[Agent] Tool round ${round}`);

    const response = await ai.chatWithTools(messages, toolSpecs);
    const toolCalls = getToolCalls(response);
    const text = getText(response);

    console.log("[Agent] Tool calls found:", toolCalls.length);
    console.log("[Agent] Text preview:", String(text).slice(0, 120));

    if (!toolCalls.length) {
      return text || "No response.";
    }

    if (
      toolCalls.length === 1 &&
      toolCalls[0]?.function?.name === "generate_image"
    ) {
      return await runToolCall(toolCalls[0]);
    }

    const assistantMessage = getAssistantMessage(response, toolCalls);
    const toolMessages = [];

    for (const call of toolCalls) {
      const result = await runToolCall(call);

      toolMessages.push({
        role: "tool",
        tool_call_id: call.id,
        content: String(result)
      });
    }

    messages = [...messages, assistantMessage, ...toolMessages];
  }

  return "Agent stopped after too many tool-calling rounds.";
}

module.exports = { runAgent };