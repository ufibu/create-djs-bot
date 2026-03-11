import { Events, Message } from "discord.js";
import type { BotClient } from "../../types/client";
import type { GuildMessage } from "../../types/command";
import type { Event } from "../../types/event";

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return;

    const client = message.client as BotClient;
    if (!message.content.startsWith(client.prefix)) return;
    if (!message.inGuild()) return;

    const args = message.content.slice(client.prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message as GuildMessage, args);
    } catch (error) {
      console.error(error);
      await message.reply("There was an error executing this command.");
    }
  },
} satisfies Event;
