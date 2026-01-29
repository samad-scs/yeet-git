#!/usr/bin/env node
import { logger, theme } from "../src/core/logger.js";
import engine from "../src/core/engine.js";
import { intro, outro, text, select, isCancel, cancel } from "@clack/prompts";
import { validateConfig, setConfig } from "../src/core/config.js";

async function main() {
  console.clear();
  intro(theme.command(" scom CLI "));

  // Validate Config
  let validation = validateConfig();
  if (!validation.valid) {
    if (validation.missing.includes("GEMINI_API_KEY")) {
      logger.error("GEMINI_API_KEY is missing.");
      const apiKey = await text({
        message: "Please enter your Gemini API Key:",
        placeholder: "AI...",
        validate: (value) => {
          if (!value) return "API Key is required.";
        },
      });

      if (isCancel(apiKey)) {
        cancel("Operation cancelled.");
        process.exit(0);
      }

      setConfig("GEMINI_API_KEY", apiKey);
      validation = validateConfig(); // Re-validate
    }

    if (!validation.valid) {
      logger.error(`Missing configuration: ${validation.missing.join(", ")}`);
      process.exit(1);
    }
  }

  let args = process.argv.slice(2);

  if (args.length === 0) {
    const action = await select({
      message: "Interactive Mode: Choose an action",
      options: [
        { value: ["--c"], label: "Commit (Auto-generate message)" },
        { value: ["--c", "--p"], label: "Commit & Push" },
        { value: ["--status"], label: "Check Status" },
      ],
    });

    if (isCancel(action)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    args = action;
  }

  try {
    await engine.parse(args);
    await engine.execute();
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }

  outro("Done.");
}

main().catch(console.error);
