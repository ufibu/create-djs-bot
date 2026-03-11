import "dotenv/config";
import { GatewayIntentBits, Collection } from "discord.js";
import { BotClient } from "./types/index";
import { loadEvents } from "./handlers/events";
import { loadHelpers } from "./handlers/helpers";

const client = new BotClient({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

async function main() {
  await loadEvents(client);
  await loadHelpers(client);

  client.login(process.env.BOT_TOKEN);
}

main();
