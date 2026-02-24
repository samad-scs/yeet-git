import { CONSTANTS } from "./constants.js";
import fs from "fs";
import path from "path";

/**
 * Global Configuration Store
 * Centralizes all user preferences and API keys in ~/.yeet/config.json
 */

const ensureStorage = () => {
  const dir = CONSTANTS.STORAGE.DIR;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const loadGlobalConfig = () => {
  try {
    const filePath = CONSTANTS.STORAGE.CONFIG_FILE;
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    // Silently fail, we'll use defaults
  }
  return {};
};

const saveGlobalConfig = (config) => {
  ensureStorage();
  const filePath = CONSTANTS.STORAGE.CONFIG_FILE;
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
};

// Internal state
const globalStore = loadGlobalConfig();

const CONFIG = {
  // Env vars take precedence, then global store, then defaults
  get GEMINI_API_KEY() {
    return process.env.GEMINI_API_KEY || globalStore.GEMINI_API_KEY;
  },

  get CONFIRMATIONS() {
    const val = process.env.CONFIRMATIONS ?? globalStore.CONFIRMATIONS;
    if (val === undefined) return CONSTANTS.DEFAULT_CONFIG.CONFIRMATIONS;
    return String(val) === "true";
  },

  // Defaults
  DEFAULT_BRANCH: CONSTANTS.DEFAULTS.BRANCH,
  DEV_BRANCH: CONSTANTS.DEFAULTS.DEV_BRANCH,
  STAGING_BRANCH: CONSTANTS.DEFAULTS.STAGING_BRANCH,

  // Model Config
  get MODEL_NAME() {
    return (
      process.env.AI_MODEL_NAME ||
      globalStore.AI_MODEL_NAME ||
      CONSTANTS.DEFAULT_CONFIG.AI_MODEL_NAME
    );
  },

  get PR_LABELS_ENABLED() {
    const val = process.env.PR_LABELS_ENABLED ?? globalStore.PR_LABELS_ENABLED;
    if (val === undefined) return CONSTANTS.DEFAULT_CONFIG.PR_LABELS_ENABLED;
    return String(val) === "true";
  },

  MAX_TOKENS: 8192,

  // Paths
  ROOT_DIR: process.cwd(),
};

/**
 * Updates a configuration value and persists it to the global store.
 */
export const setConfig = async (key, value) => {
  const persistableKeys = [
    "GEMINI_API_KEY",
    "CONFIRMATIONS",
    "AI_MODEL_NAME",
    "PR_LABELS_ENABLED",
  ];

  if (persistableKeys.includes(key)) {
    // Update local store
    globalStore[key] = value;

    // Persist to global config file
    try {
      saveGlobalConfig(globalStore);

      // Keep process.env in sync for the current session
      process.env[key] = String(value);
    } catch (err) {
      console.error("Failed to update global configuration:", err);
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
