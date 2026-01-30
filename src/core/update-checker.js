import { execa } from "execa";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { logger, theme } from "./logger.js";
import picocolors from "picocolors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function checkAndNotifyUpdate() {
  try {
    // Read package.json
    // We need to find the root package.json. Assuming we are in src/core/
    const pkgPath = path.resolve(__dirname, "../../package.json");
    const pkgContent = await fs.readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(pkgContent);

    const currentVersion = pkg.version;
    const packageName = pkg.name;

    // Fetch latest version from npm
    // Using execa to run npm view.
    // Set timeout to avoid blocking too long if network is slow.
    const { stdout } = await execa("npm", ["view", packageName, "version"], {
      timeout: 3000,
    });

    const latestVersion = stdout.trim();

    if (currentVersion !== latestVersion) {
      // Simple semver check: if strings differ and latest is likely newer.
      // We assume npm view returns the latest tag.

      const msg = `
      ╭──────────────────────────────────────────────────╮
      │                                                  │
      │   Update available! ${picocolors.red(currentVersion)} → ${picocolors.green(latestVersion)}                │
      │   Run ${picocolors.cyan("npm install -g " + packageName)} to update.    │
      │                                                  │
      ╰──────────────────────────────────────────────────╯
      `;
      console.log(msg);
    }
  } catch (error) {
    // Silently fail if network error or other issue
    // We don't want to break the user's flow for an update check
    // logger.debug("Update check failed", error);
  }
}
