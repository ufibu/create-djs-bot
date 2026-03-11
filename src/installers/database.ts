import path from "path";
import fs from "fs-extra";
import type { InstallerFn } from "../types.js";
import { copyExtras, addPackageDependency } from "../utils.js";

export const databaseInstaller: InstallerFn = (projectDir, ctx) => {
  if (ctx.database === "none") return;

  copyExtras(`database-${ctx.database}`, ctx.language, projectDir);

  const ext = ctx.ext;
  const indexPath = path.join(projectDir, `index.${ext}`);
  let content = fs.readFileSync(indexPath, "utf-8");

  if (ctx.useTypescript) {
    content = content.replace(
      `import { loadHelpers } from "./handlers/helpers.js";`,
      `import { loadHelpers } from "./handlers/helpers.js";\nimport { connectDatabase } from "./handlers/manager/database.js";`
    );
  } else {
    content = content.replace(
      `const { loadHelpers } = require("./handlers/helpers");`,
      `const { loadHelpers } = require("./handlers/helpers");\nconst { connectDatabase } = require("./handlers/manager/database");`
    );
  }

  content = content.replace(
    `  client.login(process.env.BOT_TOKEN);`,
    `  await connectDatabase();\n\n  client.login(process.env.BOT_TOKEN);`
  );

  fs.writeFileSync(indexPath, content, "utf-8");

  if (ctx.database === "mongodb") {
    addPackageDependency(projectDir, "mongoose", "^8.9.0");
  }

  const envPath = path.join(projectDir, ".env.example");
  if (ctx.database === "mongodb") {
    fs.appendFileSync(envPath, `MONGO_URI=mongodb://localhost:27017/${ctx.projectName}\n`);
  }
};
