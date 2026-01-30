import {
  intro,
  outro,
  text,
  confirm,
  isCancel,
  cancel,
  spinner,
  select,
  note,
} from "@clack/prompts";

import { execa } from "execa";

import { CONFIG, setConfig } from "../core/config.js";
import { logger, theme } from "../core/logger.js";
import github from "../services/github.js";

/**
 * Detects the user's operating system
 */
const detectOS = () => {
  const platform = process.platform;
  if (platform === "darwin") return "mac";
  if (platform === "win32") return "windows";
  return "linux";
};

/**
 * Checks if a command is available in the system
 */
const isCommandAvailable = async (command) => {
  try {
    await execa("which", [command]);
    return true;
  } catch {
    try {
      // Windows fallback
      await execa("where", [command]);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Opens a URL in the default browser
 */
const openUrl = async (url) => {
  const os = detectOS();
  try {
    if (os === "mac") {
      await execa("open", [url]);
    } else if (os === "windows") {
      await execa("start", [url], { shell: true });
    } else {
      await execa("xdg-open", [url]);
    }
  } catch {
    logger.info(`Please open this URL manually: ${url}`);
  }
};

/**
 * Guides user through gh CLI installation
 */
const installGhCli = async () => {
  const os = detectOS();

  const installInstructions = {
    mac: {
      title: "macOS",
      command: "brew install gh",
      manual: "https://github.com/cli/cli#installation",
      hasHomebrew: true,
    },
    windows: {
      title: "Windows",
      command: "winget install --id GitHub.cli",
      manual: "https://github.com/cli/cli#installation",
      hasHomebrew: false,
    },
    linux: {
      title: "Linux",
      command: "sudo apt install gh  # or check docs for your distro",
      manual: "https://github.com/cli/cli/blob/trunk/docs/install_linux.md",
      hasHomebrew: false,
    },
  };

  const info = installInstructions[os];

  note(
    `GitHub CLI (gh) is required for PR features.\n\n` +
      `Install command:\n  ${info.command}\n\n` +
      `Or visit: ${info.manual}`,
    "📦 GitHub CLI Not Found",
  );

  const action = await select({
    message: "How would you like to proceed?",
    options: [
      {
        value: "auto",
        label: `Try auto-install (${info.command.split(" ")[0]})`,
      },
      { value: "manual", label: "Open installation page in browser" },
      { value: "skip", label: "Skip for now (PR features won't work)" },
    ],
  });

  if (isCancel(action)) {
    cancel("Operation cancelled.");
    return false;
  }

  if (action === "auto") {
    const s = spinner();
    s.start("Installing GitHub CLI...");

    try {
      if (os === "mac") {
        // Check if Homebrew is installed
        const hasHomebrew = await isCommandAvailable("brew");
        if (!hasHomebrew) {
          s.stop("Homebrew not found.");
          logger.warn("Please install Homebrew first: https://brew.sh");
          logger.info("Then run: brew install gh");
          return false;
        }
        await execa("brew", ["install", "gh"], { stdio: "inherit" });
      } else if (os === "windows") {
        await execa("winget", ["install", "--id", "GitHub.cli"], {
          stdio: "inherit",
        });
      } else {
        s.stop("Auto-install not supported on this Linux distro.");
        logger.info(`Please run manually: ${info.command}`);
        return false;
      }
      s.stop("GitHub CLI installed!");
      return true;
    } catch (error) {
      s.stop("Installation failed.");
      logger.error(`Failed to install: ${error.message}`);
      logger.info(`Please install manually: ${info.manual}`);
      return false;
    }
  }

  if (action === "manual") {
    await openUrl(info.manual);
    logger.info("Opening installation page...");

    const installed = await confirm({
      message: "Press Enter once you've installed gh CLI",
    });

    if (installed && !isCancel(installed)) {
      // Verify installation
      const isInstalled = await isCommandAvailable("gh");
      if (isInstalled) {
        logger.success("GitHub CLI detected!");
        return true;
      } else {
        logger.warn(
          "gh CLI still not detected. Please restart your terminal and try again.",
        );
        return false;
      }
    }
    return false;
  }

  // Skip
  logger.warn("Skipping gh CLI setup. PR features will not work.");
  return false;
};

export const initCommand = async () => {
  intro(theme.command(" yeet init - Setup Environment "));

  // Step 1: Check if gh CLI is installed
  const hasGh = await isCommandAvailable("gh");

  if (!hasGh) {
    const installed = await installGhCli();
    if (!installed) {
      // Continue without gh, but warn
      logger.warn("Continuing without GitHub CLI...\n");
    }
  }

  // Step 2: GitHub Auth (only if gh is available)
  const ghAvailable = await isCommandAvailable("gh");

  if (ghAvailable) {
    const isAuth = await github.checkAuth();

    if (!isAuth) {
      const doLogin = await confirm({
        message: "You are not logged into GitHub. Would you like to login now?",
      });

      if (isCancel(doLogin)) {
        cancel("Operation cancelled.");
        return;
      }

      if (doLogin) {
        try {
          logger.info("Opening GitHub login...\n");
          await github.login();
          logger.success("Successfully logged into GitHub.");
        } catch (error) {
          logger.error(error.message);
        }
      }
    } else {
      logger.success("Already logged into GitHub.");
    }
  }

  // Step 3: Gemini API Key
  if (!CONFIG.GEMINI_API_KEY) {
    note(
      "You need a Gemini API key to use AI features.\n\n" +
        "Get your free key at:\nhttps://makersuite.google.com/app/apikey",
      "🔑 API Key Required",
    );

    const openApiPage = await confirm({
      message: "Open Google AI Studio to get your API key?",
      initialValue: true,
    });

    if (openApiPage && !isCancel(openApiPage)) {
      await openUrl("https://makersuite.google.com/app/apikey");
    }

    const apiKey = await text({
      message: "Paste your Gemini API Key:",
      placeholder: "AIza...",
      validate: (value) => {
        if (!value) return "API Key is required.";
        if (!value.startsWith("AIza")) return "Invalid API key format.";
      },
    });

    if (isCancel(apiKey)) {
      cancel("Operation cancelled.");
      return;
    }

    await setConfig("GEMINI_API_KEY", apiKey);
    logger.success("Gemini API Key saved to .env");
  } else {
    logger.success("Gemini API Key already configured.");

    const changeKey = await confirm({
      message: "Do you want to update it?",
      initialValue: false,
    });

    if (changeKey && !isCancel(changeKey)) {
      const apiKey = await text({
        message: "Enter new Gemini API Key:",
        placeholder: "AIza...",
      });

      if (!isCancel(apiKey) && apiKey) {
        await setConfig("GEMINI_API_KEY", apiKey);
        logger.success("Gemini API Key updated.");
      }
    }
  }

  // Summary
  note(
    "You're all set! Try these commands:\n\n" +
      "  yeet          - Interactive mode\n" +
      "  yeet --c      - AI-powered commit\n" +
      "  yeet --c --p  - Commit and push",
    "🚀 Ready to Yeet!",
  );

  outro(theme.success(" Setup Complete! "));
};
