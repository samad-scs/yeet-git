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

  // Defaults
  DEFAULT_BRANCH: CONSTANTS.DEFAULTS.BRANCH,
  DEV_BRANCH: CONSTANTS.DEFAULTS.DEV_BRANCH,
  STAGING_BRANCH: CONSTANTS.DEFAULTS.STAGING_BRANCH,

  // Model Config
  MODEL_NAME: process.env.AI_MODEL_NAME || "gemini-2.0-flash",
  MAX_TOKENS: 8192,

  // Paths
  ROOT_DIR: process.cwd(),
};

export const setConfig = async (key, value) => {
  if (key === "GEMINI_API_KEY") {
    process.env.GEMINI_API_KEY = value;
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

export const validateConfig = () => {
  const missing = [];
  if (!CONFIG.GEMINI_API_KEY) missing.push("GEMINI_API_KEY");

  if (missing.length > 0) {
    return { valid: false, missing };
  }
  return { valid: true };
};

export { CONFIG };
