import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  Message,
  NewsChannel,
  PermissionResolvable,
  SlashCommandBuilder,
  TextChannel,
  ThreadChannel,
} from "discord.js";

export type GuildMessage = Message<true> & {
  channel: TextChannel | NewsChannel | ThreadChannel;
  guild: Guild;
  member: GuildMember;
};

export interface SlashCommand {
  data: SlashCommandBuilder;
  botPermissions?: PermissionResolvable[];
  owner?: boolean;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface PrefixCommand {
  name: string;
  description: string;
  usage?: string[];
  args?: boolean;
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  owner?: boolean;
  execute: (message: GuildMessage, args: string[]) => Promise<void>;
}
