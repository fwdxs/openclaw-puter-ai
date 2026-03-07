const ai = require("../puterClient");

async function codeGen(prompt) {
  return await ai.chat([
    {
      role: "system",
      content: "You generate clean, working code."
    },
    {
      role: "user",
      content: prompt
    }
  ]);
}

module.exports = codeGen;