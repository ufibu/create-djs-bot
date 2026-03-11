const { Events } = require("discord.js");

const name = Events.InteractionCreate;

async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const reply = { content: "There was an error executing this command.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
}

module.exports = { name, execute };
