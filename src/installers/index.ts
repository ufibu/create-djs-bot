import type { InstallerFn, TemplateContext } from "../types.js";
import { slashInstaller } from "./slash.js";
import { prefixInstaller } from "./prefix.js";
import { bothInstaller } from "./both.js";
import { databaseInstaller } from "./database.js";
import { helpersInstaller } from "./helpers.js";

export function getInstallers(ctx: TemplateContext): InstallerFn[] {
  const installers: InstallerFn[] = [];

  if (ctx.commandStyle === "slash") installers.push(slashInstaller);
  else if (ctx.commandStyle === "prefix") installers.push(prefixInstaller);
  else if (ctx.commandStyle === "both") installers.push(bothInstaller);

  if (ctx.hasDatabase) installers.push(databaseInstaller);

  installers.push(helpersInstaller);

  return installers;
}
