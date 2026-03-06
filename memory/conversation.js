const fs = require("fs");
<<<<<<< HEAD
const path = require("path");

const FILE = path.join(__dirname, "..", "memory.json");

function ensureFile() {
  const dir = path.dirname(FILE);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({}, null, 2), "utf8");
  }
}

function load() {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(data) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
}

function getHistory(user) {
  const data = load();
  if (!data[user]) data[user] = [];
=======

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

>>>>>>> b93a100c415d6d8212a96095372e5c78ba44092f
  return data[user];
}

function addMessage(user, role, content) {
<<<<<<< HEAD
  const data = load();

  if (!data[user]) data[user] = [];
=======

  const data = load();

  if (!data[user]) data[user] = [];

>>>>>>> b93a100c415d6d8212a96095372e5c78ba44092f
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