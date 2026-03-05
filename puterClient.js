async function chat(messages, streamCallback) {

  const response = await puter.ai.chat(messages, {
    stream: true,
    onToken: token => {
      if (streamCallback) streamCallback(token);
    }
  });

  return response;
}

async function image(prompt) {
  return await puter.ai.image(prompt);
}

module.exports = {
  chat,
  image
};