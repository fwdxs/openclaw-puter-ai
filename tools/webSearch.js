const fetch = require("node-fetch");

async function webSearch(query) {

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;

  const res = await fetch(url);
  const data = await res.json();

  return data.AbstractText || "No results found.";
}

module.exports = webSearch;