import chalk from "chalk";
import { execSync } from "child_process";
import path from "path";
import fs from "fs-extra";
import type { UserChoices, TemplateContext } from "./types.js";

export function buildContext(choices: UserChoices): TemplateContext {
  return {
    ...choices,
    hasSlash: choices.commandStyle === "slash" || choices.commandStyle === "both",
    hasPrefix: choices.commandStyle === "prefix" || choices.commandStyle === "both",
    useTypescript: choices.language === "typescript",
    hasDatabase: choices.database !== "none",
    ext: choices.language === "typescript" ? "ts" : "js",
  };
}

export function getTemplateDir(): string {
  return path.resolve(__dirname, "..", "template");
}

export function copyExtras(
  feature: string,
  language: string,
  projectDir: string
): void {
  const src = path.join(getTemplateDir(), "extras", feature, language);
  if (!fs.existsSync(src)) return;
  fs.copySync(src, projectDir, { overwrite: true });
}

export function addPackageDependency(
  projectDir: string,
  name: string,
  version: string,
  dev = false
): void {
  const pkgPath = path.join(projectDir, "package.json");
  const pkg = fs.readJsonSync(pkgPath);
  const key = dev ? "devDependencies" : "dependencies";
  pkg[key] = pkg[key] || {};
  pkg[key][name] = version;
  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
}

export function addScript(
  projectDir: string,
  name: string,
  command: string
): void {
  const pkgPath = path.join(projectDir, "package.json");
  const pkg = fs.readJsonSync(pkgPath);
  pkg.scripts = pkg.scripts || {};
  pkg.scripts[name] = command;
  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
}

export function modifyFile(
  filePath: string,
  search: string,
  replacement: string
): void {
  const content = fs.readFileSync(filePath, "utf-8");
  fs.writeFileSync(filePath, content.replace(search, replacement), "utf-8");
}

export function appendAfter(
  filePath: string,
  search: string,
  addition: string
): void {
  const content = fs.readFileSync(filePath, "utf-8");
  fs.writeFileSync(filePath, content.replace(search, search + "\n" + addition), "utf-8");
}

export function getInstallCommand(pm: UserChoices["packageManager"]): string {
  return pm === "npm" ? "npm install" : `${pm} install`;
}

export function runInstall(projectDir: string, pm: UserChoices["packageManager"]): void {
  const cmd = getInstallCommand(pm);
  console.log(chalk.cyan(`\n  Running ${cmd}...\n`));
  try {
    execSync(cmd, { cwd: projectDir, stdio: "inherit" });
  } catch {
    console.log(chalk.yellow(`\n  Failed to install dependencies. Run "${cmd}" manually.\n`));
  }
}

export function printSuccess(projectName: string, ctx: TemplateContext): void {
  console.log();
  console.log(chalk.green.bold("  Success!") + ` Created ${chalk.cyan(projectName)}`);
  console.log();
  console.log("  Next steps:");
  console.log(chalk.cyan(`    cd ${projectName}`));
  console.log(chalk.cyan("    cp .env.example .env"));
  console.log(chalk.dim("    # Add your bot token to .env"));
  console.log();

  const run = ctx.packageManager === "npm" ? "npm run" : ctx.packageManager;

  if (ctx.useTypescript) {
    console.log(chalk.cyan(`    ${run} dev`));
  } else {
    console.log(chalk.cyan(`    ${run} start`));
  }

  if (ctx.hasSlash) {
    console.log();
    console.log("  To register slash commands:");
    console.log(chalk.cyan(`    ${run} deploy`));
  }

  console.log();
}
