import { Client, ClientOptions, Collection } from "discord.js";

export class BotClient extends Client {
  owner: string;

  constructor(options: ClientOptions) {
    super(options);
    this.owner = process.env.OWNER_ID || "";
  }
}
