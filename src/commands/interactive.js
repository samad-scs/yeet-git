import { intro, outro, select, isCancel, cancel, text } from "@clack/prompts";
import { theme, logger } from "../core/logger.js";
import engine from "../core/engine.js";
import { setConfig, validateConfig } from "../core/config.js";

export const interactive = {
  main: async () => {
    // 1. Validate Config first (Moved from bin/sc.js to here/engine, but we can do a quick check)
    // Actually, bin/sc.js does it. Let's assume basic config is present or valid.

    const action = await select({
      message: "Interactive Mode: Choose an workflow",
      options: [
        { value: "commit", label: "Commit Actions (Commit, Push)" },
        { value: "pipeline", label: "Pipeline & Sync (Merge, Promote)" },
        { value: "pr", label: "Pull Requests" },
        { value: "utils", label: "Utilities (Status, Config)" },
      ],
    });

    if (isCancel(action)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    let args = [];

    switch (action) {
      case "commit":
        args = await interactive.commitMenu();
        break;
      case "pipeline":
        args = await interactive.pipelineMenu();
        break;
      case "pr":
        args = await interactive.prMenu();
        break;
      case "utils":
        await interactive.utilsMenu();
        return; // Utils might not run engine, or might exit.
    }

    if (args && args.length > 0) {
      try {
        await engine.parse(args);
        await engine.execute();
      } catch (error) {
        logger.error(error.message);
        process.exit(1);
      }
    }
  },

  commitMenu: async () => {
    const action = await select({
      message: "Commit Actions",
      options: [
        { value: ["--c"], label: "Commit (Auto-generate message)" },
        { value: ["--c", "--p"], label: "Commit & Push" },
        { value: ["--p"], label: "Push Only" },
      ],
    });
    if (isCancel(action)) cancel("Cancelled");
    return action;
  },

  pipelineMenu: async () => {
    const action = await select({
      message: "Pipeline Actions",
      options: [
        { value: ["--to-dev", "--merge"], label: "Merge Current -> Dev" },
        { value: ["--to-staging", "--merge"], label: "Promote Dev -> Staging" }, // Assumes current is dev? Or we can be explicit.
        // The existing CLI strategies use 'current' as source for the chain.
        // So "sc --to-dev-staging" means current -> dev -> staging.
        {
          value: ["--to-dev-staging", "--merge"],
          label: "Dev -> Staging (Sync)",
        },
        {
          value: ["--to-dev-staging-main", "--merge"],
          label: "Sync All (Dev -> Staging -> Main)",
        },
      ],
    });
    if (isCancel(action)) cancel("Cancelled");
    return action;
  },

  prMenu: async () => {
    const action = await select({
      message: "Pull Request Actions",
      options: [
        { value: "main", label: "Current -> Main" },
        { value: "dev-main", label: "Dev -> Main" },
      ],
    });
    if (isCancel(action)) cancel("Cancelled");

    // We can ask for custom label or use default
    if (action === "main") {
      return ["--to-main", "--label"];
    } else if (action === "dev-main") {
      return ["--to-dev-main", "--label"];
    }
  },

  utilsMenu: async () => {
    const action = await select({
      message: "Utilities",
      options: [
        { value: "status", label: "Check Status (sc --status - Not impl yet)" },
        { value: "config", label: "Update API Key" },
      ],
    });
    if (isCancel(action)) cancel("Cancelled");

    if (action === "config") {
      const apiKey = await text({
        message: "Enter new GenAI API Key",
        placeholder: "AI...",
      });
      if (!isCancel(apiKey) && apiKey) {
        setConfig("GEMINI_API_KEY", apiKey);
        logger.success("API Key updated.");
      }
    } else if (action === "status") {
      logger.info("Status check not fully implemented yet.");
      // We could run git status here
    }
    // Loop back to main? or exit.
  },
};
