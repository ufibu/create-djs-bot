import prompts from "prompts";
import validateNpmPackageName from "validate-npm-package-name";
import type { UserChoices } from "./types.js";

export async function getUserChoices(
  projectNameArg?: string
): Promise<UserChoices | null> {
  const questions: prompts.PromptObject[] = [];

  if (!projectNameArg) {
    questions.push({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-discord-bot",
      validate: (value: string) => {
        const result = validateNpmPackageName(value);
        if (!result.validForNewPackages) {
          return result.errors?.[0] ?? "Invalid package name";
        }
        return true;
      },
    });
  }

  questions.push(
    {
      type: "select",
      name: "packageManager",
      message: "Package manager:",
      choices: [
        { title: "npm", value: "npm" },
        { title: "pnpm", value: "pnpm" },
        { title: "bun", value: "bun" },
      ],
    },
    {
      type: "select",
      name: "language",
      message: "Language:",
      choices: [
        { title: "TypeScript", value: "typescript" },
        { title: "JavaScript", value: "javascript" },
      ],
    },
    {
      type: "select",
      name: "commandStyle",
      message: "Command style:",
      choices: [
        { title: "Slash commands", value: "slash" },
        { title: "Prefix commands", value: "prefix" },
        { title: "Both", value: "both" },
      ],
    },
    {
      type: "toggle",
      name: "useSrcFolder",
      message: "Use src/ folder?",
      initial: false,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "select",
      name: "database",
      message: "Database:",
      choices: [
        { title: "None", value: "none" },
        { title: "MongoDB", value: "mongodb" },
      ],
    }
  );

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log("\nSetup cancelled.");
      process.exit(0);
    },
  });

  return {
    projectName: projectNameArg ?? answers.projectName,
    packageManager: answers.packageManager,
    language: answers.language,
    commandStyle: answers.commandStyle,
    useSrcFolder: answers.useSrcFolder,
    database: answers.database,
  };
}
