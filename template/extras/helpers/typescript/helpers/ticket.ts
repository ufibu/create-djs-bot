import { Events, ChannelType, Interaction } from "discord.js";
import type { BotClient } from "../types/client.js";

export default function (client: BotClient) {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "create-ticket") return;

    const guild = interaction.guild;
    if (!guild) return;

    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
    });

    await channel.send(`Ticket created by ${interaction.user}`);
    await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
  });
}
