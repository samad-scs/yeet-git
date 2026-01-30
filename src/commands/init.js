import {
  intro,
  outro,
  text,
  confirm,
  isCancel,
  cancel,
  spinner,
} from "@clack/prompts";
import { setConfig, CONFIG } from "../core/config.js";
import { logger, theme } from "../core/logger.js";
import github from "../services/github.js";

export const initCommand = async () => {
  intro(theme.command(" yeet init - Setup Environment "));

  // 1. GitHub Auth
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
        await github.login();
        logger.success("Successfully logged into GitHub.");
      } catch (error) {
        logger.error(error.message);
      }
    }
  } else {
    logger.success("Already logged into GitHub.");
  }

  // 2. Gemini API Key
  if (!CONFIG.GEMINI_API_KEY) {
    const apiKey = await text({
      message: "Please enter your Gemini API Key:",
      placeholder: "AI...",
      validate: (value) => {
        if (!value) return "API Key is required.";
      },
    });

    if (isCancel(apiKey)) {
      cancel("Operation cancelled.");
      return;
    }

    await setConfig("GEMINI_API_KEY", apiKey);
    logger.success("Gemini API Key saved to .env");
  } else {
    const changeKey = await confirm({
      message:
        "Gemini API Key is already configured. Do you want to update it?",
      initialValue: false,
    });

    if (changeKey && !isCancel(changeKey)) {
      const apiKey = await text({
        message: "Enter new Gemini API Key:",
        placeholder: "AI...",
      });

      if (!isCancel(apiKey) && apiKey) {
        await setConfig("GEMINI_API_KEY", apiKey);
        logger.success("Gemini API Key updated.");
      }
    }
  }

  outro(theme.success(" Setup Complete! "));
};
