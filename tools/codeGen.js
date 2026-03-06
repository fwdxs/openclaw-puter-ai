<<<<<<< HEAD
const ai = require("../puterClient");

async function codeGen(prompt) {
  return await ai.chat([
=======
async function codeGen(prompt) {

  const response = await puter.ai.chat([
>>>>>>> b93a100c415d6d8212a96095372e5c78ba44092f
    {
      role: "system",
      content: "You generate clean, working code."
    },
    {
      role: "user",
      content: prompt
    }
  ]);
<<<<<<< HEAD
=======

  return response;
>>>>>>> b93a100c415d6d8212a96095372e5c78ba44092f
}

module.exports = codeGen;