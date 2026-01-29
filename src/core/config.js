import dotenv from "dotenv";
import { CONSTANTS } from "./constants.js";
dotenv.config();

const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  // Defaults
  DEFAULT_BRANCH: CONSTANTS.DEFAULTS.BRANCH,
  DEV_BRANCH: CONSTANTS.DEFAULTS.DEV_BRANCH,
  STAGING_BRANCH: CONSTANTS.DEFAULTS.STAGING_BRANCH,

  // Model Config
  MODEL_NAME: "gemini-2.0-flash-exp",
  MAX_TOKENS: 8192,

  // Paths
  ROOT_DIR: process.cwd(),
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
