import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { getUserChoices } from "./prompts.js";
import { buildContext, runInstall, printSuccess } from "./utils.js";
import { scaffold } from "./scaffold.js";

const program = new Command();

program
  .name("create-djs-bot")
  .description("Scaffold a Discord.js bot project")
  .version("1.0.0")
  .argument("[project-name]", "Name of the project")
  .action(async (projectNameArg?: string) => {
    console.log();
    console.log(chalk.bold("  create-djs-bot") + chalk.dim(" — Discord.js bot scaffolder"));
    console.log();

    const choices = await getUserChoices(projectNameArg);
    if (!choices) return;

    const projectDir = path.resolve(process.cwd(), choices.projectName);

    if (fs.existsSync(projectDir)) {
      console.log(
        chalk.red(`\n  Error: Directory "${choices.projectName}" already exists.\n`)
      );
      process.exit(1);
    }

    const ctx = buildContext(choices);

    console.log();
    console.log(chalk.dim("  Scaffolding project..."));

    await scaffold(projectDir, ctx);
    runInstall(projectDir, ctx.packageManager);
    printSuccess(choices.projectName, ctx);
  });

program.parse();
