import "dotenv/config";
import { REST, Routes } from "discord.js";
import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";

const commands: unknown[] = [];
const commandsDir = path.resolve(import.meta.dirname, "..", "commands", "slash");

async function deploy() {
  const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  for (const file of files) {
    const command = await import(pathToFileURL(path.join(commandsDir, file)).href);
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST().setToken(process.env.BOT_TOKEN!);

  console.log(`Deploying ${commands.length} slash commands...`);

  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
    { body: commands }
  );

  console.log("Successfully deployed slash commands.");
}

deploy().catch(console.error);
