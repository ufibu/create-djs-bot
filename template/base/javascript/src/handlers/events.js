const path = require("path");
const fs = require("fs");

async function loadEvents(client) {
  const eventsDir = path.resolve(__dirname, "..", "events");
  if (!fs.existsSync(eventsDir)) return;

  const folders = fs.readdirSync(eventsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const folder of folders) {
    const folderPath = path.join(eventsDir, folder.name);
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".js"));

    for (const file of files) {
      const event = require(path.join(folderPath, file));

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }
}

module.exports = { loadEvents };
