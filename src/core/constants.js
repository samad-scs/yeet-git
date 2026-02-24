import path from "path";
import os from "os";

const STORAGE_DIR = path.join(os.homedir(), ".yeet");

export const CONSTANTS = {
  PR_DEFAULT_LABEL: "🤖JARVIS",

  STORAGE: {
    DIR: STORAGE_DIR,
    CONFIG_FILE: path.join(STORAGE_DIR, "config.json"),
    PIPELINES_FILE: path.join(STORAGE_DIR, "pipelines.json"),
  },

  // Potential future static values can go here
  DEFAULTS: {
    BRANCH: "main",
    DEV_BRANCH: "dev",
    STAGING_BRANCH: "staging",
    REMOTE: "origin",
  },

  // Default configuration values
  DEFAULT_CONFIG: {
    CONFIRMATIONS: true,
    AI_MODEL_NAME: "gemini-2.0-flash",
    PR_LABELS_ENABLED: true,
  },
};
