import path from "path";
import fs from "fs";
import { pathToFileURL } from "url";
import type { BotClient } from "../types/client.js";

export async function loadHelpers(client: BotClient): Promise<void> {
  const helpersDir = path.resolve(import.meta.dirname, "..", "helpers");
  if (!fs.existsSync(helpersDir)) return;

  const files = fs.readdirSync(helpersDir).filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(helpersDir, file);
    const helper = await import(pathToFileURL(filePath).href);
    if (typeof helper.default === "function") {
      helper.default(client);
    }
  }
}
