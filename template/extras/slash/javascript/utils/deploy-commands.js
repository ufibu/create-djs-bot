require("dotenv/config");
const { REST, Routes } = require("discord.js");
const path = require("path");
const fs = require("fs");

const commands = [];
const commandsDir = path.resolve(__dirname, "..", "commands", "slash");

async function deploy() {
  const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    const command = require(path.join(commandsDir, file));
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST().setToken(process.env.BOT_TOKEN);

  console.log(`Deploying ${commands.length} slash commands...`);

  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );

  console.log("Successfully deployed slash commands.");
}

deploy().catch(console.error);
