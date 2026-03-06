<<<<<<< HEAD
async function webSearch(query) {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();

  const results = [];

  const regex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g;

  let match;

  while ((match = regex.exec(html)) !== null && results.length < 5) {
    const link = match[1];
    const title = match[2].replace(/<[^>]+>/g, "");

    results.push(`${title}\n${link}`);
  }

  if (!results.length) {
    return `No results found for: ${query}`;
  }

  return results.join("\n\n");
=======
const fetch = require("node-fetch");

async function webSearch(query) {

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;

  const res = await fetch(url);
  const data = await res.json();

  return data.AbstractText || "No results found.";
>>>>>>> b93a100c415d6d8212a96095372e5c78ba44092f
}

module.exports = webSearch;