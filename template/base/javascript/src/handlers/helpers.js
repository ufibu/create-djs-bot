const path = require("path");
const fs = require("fs");

async function loadHelpers(client) {
  const helpersDir = path.resolve(__dirname, "..", "helpers");
  if (!fs.existsSync(helpersDir)) return;

  const files = fs.readdirSync(helpersDir).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    const helper = require(path.join(helpersDir, file));
    if (typeof helper === "function") {
      helper(client);
    }
  }
}

module.exports = { loadHelpers };
