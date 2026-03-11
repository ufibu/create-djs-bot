const { Events } = require("discord.js");

const name = Events.MessageCreate;

async function execute(message) {
  if (message.author.bot) return;

  const client = message.client;
  if (!message.content.startsWith(client.prefix)) return;
  if (!message.inGuild()) return;

  const args = message.content.slice(client.prefix.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await message.reply("There was an error executing this command.");
  }
}

module.exports = { name, execute };
