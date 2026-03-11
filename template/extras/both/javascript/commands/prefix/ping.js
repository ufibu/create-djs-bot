module.exports = {
  name: "ping",
  description: "Replies with Pong!",

  async execute(message) {
    const sent = await message.reply("Pinging...");
    sent.edit(`Pong! Latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
  },
};
