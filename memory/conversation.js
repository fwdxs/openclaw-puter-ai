const fs = require("fs");

const FILE = "./plugins/openclaw-puter-ai/memory.json";

function load() {

  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({}));
  }

  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function getHistory(user) {

  const data = load();

  if (!data[user]) data[user] = [];

  return data[user];
}

function addMessage(user, role, content) {

  const data = load();

  if (!data[user]) data[user] = [];

  data[user].push({ role, content });

  if (data[user].length > 20) {
    data[user].shift();
  }

  save(data);
}

module.exports = {
  getHistory,
  addMessage
};