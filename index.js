console.log("Puter AI plugin loaded");

const ai = require("./puterClient");
const memory = require("./memory/conversation");
const agent = require("./agent");

module.exports = function register(api) {
  console.log("REGISTER FUNCTION CALLED");

  api.registerCommand({
    name: "ai",
    description: "Puter AI assistant",
    acceptsArgs: true,

    handler: async (ctx) => {
      console.log("COMMAND RECEIVED:", ctx);

      try {
        const rawArgs =
          Array.isArray(ctx.args) ? ctx.args.join(" ") : String(ctx.args || "");

        const trimmed = rawArgs.trim();
        const [sub, ...rest] = trimmed.split(/\s+/);
        const prompt = rest.join(" ");
        const user = ctx.senderId || ctx.userId || "default";

        // plain /ai hello -> autonomous agent mode
        if (!trimmed) {
          return {
            text:
              "Usage: /ai <prompt> | /ai chat <prompt> | /ai summarize <text> | /ai image <prompt> | /ai agent <prompt> | /ai code <prompt> | /ai search <prompt> | /ai analyze <text>"
          };
        }

        // default agent mode when user does /ai something
        const knownSubs = new Set([
          "chat",
          "summarize",
          "image",
          "agent",
          "code",
          "search",
          "analyze"
        ]);

        if (!knownSubs.has(sub)) {
          console.log("[Index] Defaulting to autonomous agent mode");
          const response = await agent.runAgent(trimmed);
          return { text: response };
        }

        if (sub === "chat") {
          const history = memory.getHistory(user);
          let result = "";

          const response = await ai.chat(
            [...history, { role: "user", content: prompt }],
            (token) => {
              result += token;
            }
          );

          if (!result && typeof response === "string") {
            result = response;
          }

          memory.addMessage(user, "user", prompt);
          memory.addMessage(user, "assistant", result);

          return { text: result || "No response from Puter." };
        }

        if (sub === "summarize") {
          const response = await ai.chat([
            {
              role: "system",
              content: "Summarize the following text clearly and concisely."
            },
            {
              role: "user",
              content: prompt
            }
          ]);

          return { text: response };
        }

        if (sub === "image") {
          console.log("[Index] Image branch hit:", prompt);

          const response = await ai.image(prompt);

          console.log("[Index] Image branch response type:", typeof response);
          console.log("[Index] Image branch response preview:", String(response).slice(0, 120));

          return {
            text: typeof response === "string" ? response : JSON.stringify(response, null, 2)
          };
        }

        if (sub === "agent") {
          const response = await agent.runAgent(prompt);
          return { text: response };
        }

        if (sub === "code") {
          const response = await agent.runAgent(`Write code for: ${prompt}`);
          return { text: response };
        }

        if (sub === "search") {
          const response = await agent.runAgent(`Search for: ${prompt}`);
          return { text: response };
        }

        if (sub === "analyze") {
          const response = await agent.runAgent(
            `Analyze the following content:\n${prompt}`
          );
          return { text: response };
        }

        return {
          text:
            "Usage: /ai <prompt> | /ai chat <prompt> | /ai summarize <text> | /ai image <prompt> | /ai agent <prompt> | /ai code <prompt> | /ai search <prompt> | /ai analyze <text>"
        };
      } catch (err) {
        console.error("PLUGIN ERROR:", err);
        return {
          text: `Plugin error: ${err.message || String(err)}`
        };
      }
    }
  });
};