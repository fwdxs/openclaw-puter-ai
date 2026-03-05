console.log("Puter AI plugin loaded");
const ai = require("./puterClient");
const memory = require("./memory/conversation");
const agent = require("./agent");

module.exports = {

  name: "puter-ai",

  async handleCommand(command, args, user, stream) {

    const prompt = args.join(" ");

    if (command === "/ai chat") {

      const history = memory.getHistory(user);

      let result = "";

      await ai.chat(
        [...history, { role: "user", content: prompt }],
        token => {
          result += token;
          if (stream) stream(token);
        }
      );

      memory.addMessage(user, "user", prompt);
      memory.addMessage(user, "assistant", result);

      return result;
    }

    if (command === "/ai summarize") {

      const response = await ai.chat([
        { role: "system", content: "Summarize the following text." },
        { role: "user", content: prompt }
      ]);

      return response;
    }

    if (command === "/ai image") {
      return await ai.image(prompt);
    }

    if (command === "/ai code") {
      return await agent.runAgent("Write code for: " + prompt);
    }

    if (command === "/ai search") {
      return await agent.runAgent(prompt);
    }

    if (command === "/ai analyze") {
      return await agent.runAgent("Analyze the following content:\n" + prompt);
    }

  }
};