import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
import type { BotClient } from "../types/client";

export async function loadPrefixCommands(client: BotClient): Promise<void> {
  const commandsDir = path.resolve(import.meta.dirname, "..", "commands", "prefix");
  if (!fs.existsSync(commandsDir)) return;

  const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const command = await import(pathToFileURL(filePath).href);
    if (command.name && command.execute) {
      client.prefixCommands.set(command.name, command);
    }
  }
}
