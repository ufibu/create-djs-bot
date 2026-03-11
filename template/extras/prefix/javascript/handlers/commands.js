const path = require("path");
const fs = require("fs");

async function loadPrefixCommands(client) {
  const commandsDir = path.resolve(__dirname, "..", "commands", "prefix");
  if (!fs.existsSync(commandsDir)) return;

  const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    const command = require(path.join(commandsDir, file));
    if (command.name && command.execute) {
      client.prefixCommands.set(command.name, command);
    }
  }
}

module.exports = { loadPrefixCommands };
