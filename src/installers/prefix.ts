import path from "path";
import fs from "fs-extra";
import type { InstallerFn } from "../types.js";
import { copyExtras } from "../utils.js";

export const prefixInstaller: InstallerFn = (projectDir, ctx) => {
  copyExtras("prefix", ctx.language, projectDir);

  const ext = ctx.ext;
  const indexPath = path.join(projectDir, `index.${ext}`);
  let content = fs.readFileSync(indexPath, "utf-8");

  if (ctx.useTypescript) {
    content = content.replace(
      `import { loadHelpers } from "./handlers/helpers.js";`,
      `import { loadHelpers } from "./handlers/helpers.js";\nimport { loadPrefixCommands } from "./handlers/commands.js";`
    );

    content = content.replace(
      `    GatewayIntentBits.Guilds,`,
      `    GatewayIntentBits.Guilds,\n    GatewayIntentBits.GuildMessages,\n    GatewayIntentBits.MessageContent,`
    );

    content = content.replace(
      `  await loadHelpers(client);`,
      `  await loadHelpers(client);\n  await loadPrefixCommands(client);`
    );

    const clientPath = path.join(projectDir, "types", "client.ts");
    let clientContent = fs.readFileSync(clientPath, "utf-8");
    clientContent = clientContent.replace(
      `import { Client, ClientOptions, Collection } from "discord.js";`,
      `import { Client, ClientOptions, Collection } from "discord.js";\nimport type { PrefixCommand } from "./command.js";`
    );
    clientContent = clientContent.replace(
      `  owner: string;`,
      `  owner: string;\n  prefix: string;\n  prefixCommands: Collection<string, PrefixCommand> = new Collection();`
    );
    clientContent = clientContent.replace(
      `    this.owner = process.env.OWNER_ID || "";`,
      `    this.owner = process.env.OWNER_ID || "";\n    this.prefix = process.env.PREFIX || "!";`
    );
    fs.writeFileSync(clientPath, clientContent, "utf-8");
  } else {
    content = content.replace(
      `const { loadHelpers } = require("./handlers/helpers");`,
      `const { loadHelpers } = require("./handlers/helpers");\nconst { loadPrefixCommands } = require("./handlers/commands");`
    );

    content = content.replace(
      `    GatewayIntentBits.Guilds,`,
      `    GatewayIntentBits.Guilds,\n    GatewayIntentBits.GuildMessages,\n    GatewayIntentBits.MessageContent,`
    );

    content = content.replace(
      `  await loadHelpers(client);`,
      `  await loadHelpers(client);\n  await loadPrefixCommands(client);`
    );
  }

  fs.writeFileSync(indexPath, content, "utf-8");

  const envPath = path.join(projectDir, ".env.example");
  fs.appendFileSync(envPath, "PREFIX=!\n");
};
