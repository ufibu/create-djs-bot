import path from "path";
import fs from "fs-extra";
import type { InstallerFn } from "../types.js";
import { copyExtras, addScript } from "../utils.js";

export const slashInstaller: InstallerFn = (projectDir, ctx) => {
  copyExtras("slash", ctx.language, projectDir);

  const ext = ctx.ext;
  const indexPath = path.join(projectDir, `index.${ext}`);
  let content = fs.readFileSync(indexPath, "utf-8");

  if (ctx.useTypescript) {
    content = content.replace(
      `import { loadHelpers } from "./handlers/helpers.js";`,
      `import { loadHelpers } from "./handlers/helpers.js";\nimport { loadSlashCommands } from "./handlers/commands.js";`
    );

    content = content.replace(
      `const client = new BotClient({`,
      `const client = new BotClient({`
    );

    content = content.replace(
      `  await loadHelpers(client);`,
      `  await loadHelpers(client);\n  await loadSlashCommands(client);`
    );

    const clientPath = path.join(projectDir, "types", "client.ts");
    let clientContent = fs.readFileSync(clientPath, "utf-8");
    clientContent = clientContent.replace(
      `import { Client, ClientOptions, Collection } from "discord.js";`,
      `import { Client, ClientOptions, Collection } from "discord.js";\nimport type { SlashCommand } from "./command.js";`
    );
    clientContent = clientContent.replace(
      `  owner: string;`,
      `  owner: string;\n  slashCommands: Collection<string, SlashCommand> = new Collection();`
    );
    fs.writeFileSync(clientPath, clientContent, "utf-8");
  } else {
    content = content.replace(
      `const { loadHelpers } = require("./handlers/helpers");`,
      `const { loadHelpers } = require("./handlers/helpers");\nconst { loadSlashCommands } = require("./handlers/commands");`
    );

    content = content.replace(
      `const client = new Client({`,
      `const client = new Client({`
    );

    content = content.replace(
      `  await loadHelpers(client);`,
      `  await loadHelpers(client);\n  await loadSlashCommands(client);`
    );
  }

  fs.writeFileSync(indexPath, content, "utf-8");

  const deployCmd = ctx.useTypescript
    ? `tsx utils/deploy-commands.${ext}`
    : `node utils/deploy-commands.${ext}`;
  addScript(projectDir, "deploy", deployCmd);
};
