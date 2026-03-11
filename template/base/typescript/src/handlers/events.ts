import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
import type { BotClient } from "../types/client";
import type { Event } from "../types/event";

export async function loadEvents(client: BotClient): Promise<void> {
  const eventsDir = path.resolve(import.meta.dirname, "..", "events");
  if (!fs.existsSync(eventsDir)) return;

  const folders = fs.readdirSync(eventsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const folder of folders) {
    const folderPath = path.join(eventsDir, folder.name);
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const eventModule = await import(pathToFileURL(filePath).href);
      const event: Event = eventModule.default;

      if (event.once) {
        client.once(event.name, (...args: unknown[]) => event.execute(...args));
      } else {
        client.on(event.name, (...args: unknown[]) => event.execute(...args));
      }
    }
  }
}
