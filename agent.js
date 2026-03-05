const webSearch = require("./tools/webSearch");
const codeGen = require("./tools/codeGen");

async function runAgent(prompt) {

  const systemPrompt = `
You are an AI agent with tools:

webSearch(query) → search the internet
codeGen(prompt) → generate code

Use them when helpful.
`;

  const response = await puter.ai.chat([
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt }
  ]);

  return response;
}

module.exports = { runAgent };