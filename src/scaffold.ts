import path from "path";
import fs from "fs-extra";
import type { TemplateContext } from "./types.js";
import { getTemplateDir } from "./utils.js";
import { getInstallers } from "./installers/index.js";

export async function scaffold(
  projectDir: string,
  ctx: TemplateContext
): Promise<void> {
  const templateDir = getTemplateDir();
  const baseDir = path.join(templateDir, "base", ctx.language);

  fs.copySync(baseDir, projectDir);

  const gitignoreSrc = path.join(projectDir, "_gitignore");
  if (fs.existsSync(gitignoreSrc)) {
    fs.renameSync(gitignoreSrc, path.join(projectDir, ".gitignore"));
  }

  const pkgPath = path.join(projectDir, "package.json");
  const pkg = fs.readJsonSync(pkgPath);
  pkg.name = ctx.projectName;
  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

  if (!ctx.useSrcFolder) {
    const srcDir = path.join(projectDir, "src");
    if (fs.existsSync(srcDir)) {
      const entries = fs.readdirSync(srcDir);
      for (const entry of entries) {
        fs.moveSync(path.join(srcDir, entry), path.join(projectDir, entry));
      }
      fs.removeSync(srcDir);
    }
  }

  const codeRoot = ctx.useSrcFolder
    ? path.join(projectDir, "src")
    : projectDir;

  if (ctx.useTypescript) {
    const tsconfigPath = path.join(projectDir, "tsconfig.json");
    if (fs.existsSync(tsconfigPath) && ctx.useSrcFolder) {
      const tsconfig = fs.readJsonSync(tsconfigPath);
      tsconfig.include = ["src/**/*.ts"];
      fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });
    }

    const pkgUpdated = fs.readJsonSync(pkgPath);
    const prefix = ctx.useSrcFolder ? "src/" : "";
    pkgUpdated.scripts.dev = `tsx ${prefix}index.ts`;
    pkgUpdated.scripts.start = `node ${ctx.useSrcFolder ? "dist/" : ""}index.js`;
    fs.writeJsonSync(pkgPath, pkgUpdated, { spaces: 2 });
  } else {
    const pkgUpdated = fs.readJsonSync(pkgPath);
    const prefix = ctx.useSrcFolder ? "src/" : "";
    pkgUpdated.scripts.start = `node ${prefix}index.js`;
    fs.writeJsonSync(pkgPath, pkgUpdated, { spaces: 2 });
  }

  const installers = getInstallers(ctx);
  for (const installer of installers) {
    installer(codeRoot, ctx);
  }
}
