require("dotenv/config");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { loadEvents } = require("./handlers/events");
const { loadHelpers } = require("./handlers/helpers");

const client = new Client({
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
