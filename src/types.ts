export interface UserChoices {
  projectName: string;
  packageManager: "npm" | "pnpm" | "bun";
  language: "typescript" | "javascript";
  commandStyle: "prefix" | "slash" | "both";
  useSrcFolder: boolean;
  database: "none" | "mongodb";
}

export interface TemplateContext extends UserChoices {
  hasSlash: boolean;
  hasPrefix: boolean;
  useTypescript: boolean;
  hasDatabase: boolean;
  ext: string;
}

export type InstallerFn = (projectDir: string, ctx: TemplateContext) => void;
