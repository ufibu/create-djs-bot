import type { InstallerFn } from "../types.js";
import { copyExtras } from "../utils.js";

export const helpersInstaller: InstallerFn = (projectDir, ctx) => {
  copyExtras("helpers", ctx.language, projectDir);
};
