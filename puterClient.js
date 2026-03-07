console.log("puterClient.js loaded");

const fs = require("fs");
const path = require("path");
const { init, getAuthToken } = require("@heyputer/puter.js/src/init.cjs");

let puterInstance = null;

const MODELS = {
  chat: "gpt-5.3-chat",
  code: "openai/gpt-5.3-codex",
  image: "openai/gpt-image-1"
};

const TOKEN_FILE = path.join(__dirname, ".puter-token.json");
const OUTPUT_DIR = path.join(__dirname, "generated");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadSavedToken() {
  try {
    if (!fs.existsSync(TOKEN_FILE)) return null;
    const raw = fs.readFileSync(TOKEN_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch (err) {
    console.error("[Puter] Failed loading token:", err);
    return null;
  }
}

function saveToken(token) {
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token }, null, 2), "utf8");
    console.log("[Puter] Token saved");
  } catch (err) {
    console.error("[Puter] Failed saving token:", err);
  }
}

async function getPuter() {
  if (puterInstance) return puterInstance;

  let token = process.env.puterAuthToken || loadSavedToken();

  if (!token) {
    console.log("[Puter] Starting auth flow");
    token = await getAuthToken();
    if (!token) {
      throw new Error("Failed to get Puter auth token.");
    }
    saveToken(token);
  }

  puterInstance = init(token);
  console.log("[Puter] Initialized");

  return puterInstance;
}

function pickChatModel(messages) {
  const combined = Array.isArray(messages)
    ? messages.map((m) => m?.content || "").join(" ")
    : String(messages || "");

  const text = combined.toLowerCase();

  const codeSignals = [
    "code",
    "debug",
    "bug",
    "function",
    "class",
    "javascript",
    "typescript",
    "python",
    "api",
    "error",
    "stack trace",
    "plugin",
    "openclaw"
  ];

  const shouldUseCodex = codeSignals.some((s) => text.includes(s));
  const model = shouldUseCodex ? MODELS.code : MODELS.chat;

  console.log("[Model Router] Selected:", model);
  return model;
}

function extractText(resp) {
  if (!resp) return "";

  if (typeof resp === "string") return resp;
  if (typeof resp?.text === "string") return resp.text;
  if (typeof resp?.message?.content === "string") return resp.message.content;
  if (typeof resp?.choices?.[0]?.message?.content === "string") {
    return resp.choices[0].message.content;
  }

  return JSON.stringify(resp, null, 2);
}

async function chat(messages, streamCallback) {
  const puter = await getPuter();
  const model = pickChatModel(messages);
  let fullText = "";

  console.log("[Puter Chat] Starting with model:", model);

  const response = await puter.ai.chat(messages, {
    model,
    stream: true
  });

  for await (const token of response) {
    const chunk =
      typeof token === "string"
        ? token
        : token?.text || token?.content || token?.delta || "";

    fullText += chunk;
    if (streamCallback) streamCallback(chunk);
  }

  return fullText || "No response from Puter.";
}

async function chatWithTools(messages, tools) {
  const puter = await getPuter();
  const model = pickChatModel(messages);

  console.log("[Puter Tools] Starting with model:", model);

  const response = await puter.ai.chat(messages, {
    model,
    tools,
    stream: false
  });

  return response;
}

async function image(prompt) {
  const puter = await getPuter();

  console.log("[Puter Image] Prompt:", prompt);

  const response = await puter.ai.txt2img(prompt, {
    model: MODELS.image
  });

  console.log("[Puter Image] Raw response keys:", Object.keys(response || {}));

  let src = null;

  if (typeof response === "string") {
    src = response;
  } else if (response?.src) {
    src = response.src;
  } else if (response?.url) {
    src = response.url;
  } else if (response?.image?.src) {
    src = response.image.src;
  } else if (response?.image?.url) {
    src = response.image.url;
  } else if (response?.data?.src) {
    src = response.data.src;
  } else if (response?.data?.url) {
    src = response.data.url;
  } else if (Array.isArray(response) && response[0]?.src) {
    src = response[0].src;
  } else if (Array.isArray(response) && response[0]?.url) {
    src = response[0].url;
  }

  if (!src) {
    console.log("[Puter Image] Full response:", response);
    throw new Error("Image response did not contain a usable src/url field.");
  }

  console.log("[Puter Image] src preview:", src.slice(0, 80));

  if (!src.startsWith("data:")) {
    return `Image generated:\n${src}`;
  }

  ensureDir(OUTPUT_DIR);

  const match = src.match(/^data:([^;,]*)?;base64,(.+)$/);

  if (!match) {
    throw new Error("Unsupported data URL format.");
  }

  const mimeType = match[1] || "";
  const base64 = match[2];

  let ext = "png";
  if (mimeType.includes("webp")) ext = "webp";
  else if (mimeType.includes("jpeg")) ext = "jpg";
  else if (mimeType.includes("jpg")) ext = "jpg";
  else if (mimeType.includes("png")) ext = "png";
  else if (mimeType.includes("gif")) ext = "gif";

  const filename = `ai-image-${Date.now()}.${ext}`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filepath, Buffer.from(base64, "base64"));

  console.log("[Puter Image] Saved file:", filepath);

  return `Image generated:\n${filepath}`;
}

module.exports = {
  chat,
  chatWithTools,
  image,
  getPuter,
  pickChatModel,
  extractText,
  MODELS
};