import type { GuildMessage } from "../../types/command.js";

export const name = "ping";
export const description = "Replies with Pong!";

export async function execute(message: GuildMessage) {
  const sent = await message.reply("Pinging...");
  sent.edit(`Pong! Latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
}
