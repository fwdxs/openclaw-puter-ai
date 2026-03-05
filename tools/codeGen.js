async function codeGen(prompt) {

  const response = await puter.ai.chat([
    {
      role: "system",
      content: "You generate clean, working code."
    },
    {
      role: "user",
      content: prompt
    }
  ]);

  return response;
}

module.exports = codeGen;