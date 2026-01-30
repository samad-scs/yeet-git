import dotenv from "dotenv";
import { CONSTANTS } from "./constants.js";
import fs from "fs/promises";
import path from "path";
dotenv.config();

const CONFIG = {
  // Dynamic getter to allow runtime updates
  get GEMINI_API_KEY() {
    return process.env.GEMINI_API_KEY;
  },

  get CONFIRMATIONS() {
    const val = process.env.CONFIRMATIONS;
    if (val === undefined) return CONSTANTS.DEFAULT_CONFIG.CONFIRMATIONS;
    return val === "true";
  },

  // Defaults
  DEFAULT_BRANCH: CONSTANTS.DEFAULTS.BRANCH,
  DEV_BRANCH: CONSTANTS.DEFAULTS.DEV_BRANCH,
  STAGING_BRANCH: CONSTANTS.DEFAULTS.STAGING_BRANCH,

  // Model Config
  get MODEL_NAME() {
    return process.env.AI_MODEL_NAME || CONSTANTS.DEFAULT_CONFIG.AI_MODEL_NAME;
  },

  get PR_LABELS_ENABLED() {
    const val = process.env.PR_LABELS_ENABLED;
    if (val === undefined) return CONSTANTS.DEFAULT_CONFIG.PR_LABELS_ENABLED;
    return val === "true";
  },

  MAX_TOKENS: 8192,

  // Paths
  ROOT_DIR: process.cwd(),
};

export const setConfig = async (key, value) => {
  const persistableKeys = [
    "GEMINI_API_KEY",
    "CONFIRMATIONS",
    "AI_MODEL_NAME",
    "PR_LABELS_ENABLED",
  ];

  if (persistableKeys.includes(key)) {
    process.env[key] = String(value);
    // Persist to .env
    try {
      const envPath = path.join(process.cwd(), ".env");
      let envContent = "";
      try {
        envContent = await fs.readFile(envPath, "utf-8");
      } catch (e) {
        // ignore if file doesn't exist
      }

      const regex = new RegExp(`^${key}=.*`, "m");
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
      await fs.writeFile(envPath, envContent.trim() + "\n");
    } catch (err) {
      console.error("Failed to update .env file:", err);
    }
  } else {
    // For other static properties if needed
    CONFIG[key] = value;
  }
};

export const getConfig = () => {
  return {
    GEMINI_API_KEY: CONFIG.GEMINI_API_KEY
      ? "***" + CONFIG.GEMINI_API_KEY.slice(-4)
      : "Not Set",
    CONFIRMATIONS: CONFIG.CONFIRMATIONS,
    AI_MODEL_NAME: CONFIG.MODEL_NAME,
    PR_LABELS_ENABLED: CONFIG.PR_LABELS_ENABLED,
    PR_DEFAULT_LABEL: CONSTANTS.PR_DEFAULT_LABEL,
    DEFAULT_BRANCH: CONFIG.DEFAULT_BRANCH,
    DEV_BRANCH: CONFIG.DEV_BRANCH,
    STAGING_BRANCH: CONFIG.STAGING_BRANCH,
  };
};

export const resetConfig = async () => {
  await setConfig("CONFIRMATIONS", CONSTANTS.DEFAULT_CONFIG.CONFIRMATIONS);
  await setConfig("AI_MODEL_NAME", CONSTANTS.DEFAULT_CONFIG.AI_MODEL_NAME);
  await setConfig(
    "PR_LABELS_ENABLED",
    CONSTANTS.DEFAULT_CONFIG.PR_LABELS_ENABLED,
  );
};

export const validateConfig = () => {
  const missing = [];
  if (!CONFIG.GEMINI_API_KEY) missing.push("GEMINI_API_KEY");

  if (missing.length > 0) {
    return { valid: false, missing };
  }
  return { valid: true };
};

export { CONFIG };
