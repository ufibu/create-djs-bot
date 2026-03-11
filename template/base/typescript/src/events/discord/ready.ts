import { Client, Events } from "discord.js";
import type { Event } from "../../types/event.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client<true>) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
} satisfies Event;
