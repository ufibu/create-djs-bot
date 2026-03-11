const path = require("path");
const fs = require("fs");

async function loadSlashCommands(client) {
  const commandsDir = path.resolve(__dirname, "..", "commands", "slash");
  if (!fs.existsSync(commandsDir)) return;

  const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    const command = require(path.join(commandsDir, file));
    if (command.data && command.execute) {
      client.slashCommands.set(command.data.name, command);
    }
  }
}

module.exports = { loadSlashCommands };
