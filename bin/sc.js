#!/usr/bin/env node
import { logger, theme } from "../src/core/logger.js";
import engine from "../src/core/engine.js";
import { interactive } from "../src/commands/interactive.js";
import { intro, outro, text, isCancel, cancel } from "@clack/prompts";
import { validateConfig, setConfig } from "../src/core/config.js";

async function main() {
  console.clear();
  intro(theme.command(" sc CLI "));

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

  if (args[0] === "init") {
    const { initCommand } = await import("../src/commands/init.js");
    await initCommand();
    return;
  }

  if (args.length === 0) {
    await interactive.main();
    return;
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
