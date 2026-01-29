#!/usr/bin/env node
import { logger } from "../src/core/logger.js";
import engine from "../src/core/engine.js";
import { intro, outro } from "@clack/prompts";
import { validateConfig } from "../src/core/config.js";

async function main() {
  console.clear();
  intro(logger.theme.command(" scom CLI "));

  // Validate Config
  const validation = validateConfig();
  if (!validation.valid) {
    logger.error(`Missing configuration: ${validation.missing.join(", ")}`);
    logger.info("Please set them in your environment or .env file.");
    process.exit(1);
  }

  const args = process.argv.slice(2);

  if (args.length === 0) {
    logger.info(
      'Interactive mode not yet implemented. Try "scom --c" or "scom --help".',
    );
    process.exit(0);
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
