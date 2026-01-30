import { execa } from "execa";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../../../../src/core/logger.js";
import ai from "../../../../src/services/ai.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = process.cwd(); // Assume run from root
const CHANGELOG_PATH = path.join(ROOT_DIR, "CHANGELOG.md");

async function getLatestTag() {
  try {
    const { stdout } = await execa("git", ["describe", "--tags", "--abbrev=0"]);
    return stdout.trim();
  } catch (error) {
    return null;
  }
}

async function getCommits(sinceTag) {
  const range = sinceTag ? `${sinceTag}..HEAD` : "HEAD";
  const args = ["log", "--pretty=format:%H|%s|%an|%ad", "--date=short"];
  if (sinceTag) args.push(range);

  try {
    const { stdout } = await execa("git", args);
    if (!stdout) return [];
    return stdout.split("\n").map((line) => {
      const [hash, message, author, date] = line.split("|");
      return { hash, message, author, date };
    });
  } catch (error) {
    return [];
  }
}

async function main() {
  logger.info("Checking git history...");

  const latestTag = await getLatestTag();
  const commits = await getCommits(latestTag);

  if (commits.length === 0) {
    logger.warn(
      "No new commits found since last tag (" + (latestTag || "start") + ").",
    );
    return;
  }

  logger.info(`Found ${commits.length} commits since ${latestTag || "start"}.`);
  logger.info("Generating changelog with AI...");

  try {
    const changelogContent = await ai.generateChangelog(commits);

    // Read package.json for version
    const pkg = JSON.parse(
      await fs.readFile(path.join(ROOT_DIR, "package.json"), "utf-8"),
    );
    const version = pkg.version;
    const date = new Date().toISOString().split("T")[0];
    const versionTitle = `## [${version}] - ${date}`;
    const newEntry = `${versionTitle}\n\n${changelogContent}\n\n`;

    // Read existing
    let existingContent = "";
    try {
      existingContent = await fs.readFile(CHANGELOG_PATH, "utf-8");
    } catch (e) {
      existingContent =
        "# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n";
    }

    // Prepend
    // If existing has a header, keep it?
    // Let's just prepend after the header if it exists, or just prepend.
    // Simple approach: Split by first header?
    // Or just write new entry after the main title if present.

    let finalContent = "";
    if (existingContent.startsWith("# Changelog")) {
      const parts = existingContent.split("\n\n");
      const header = parts.slice(0, 2).join("\n\n"); // Title + Description
      const rest = parts.slice(2).join("\n\n");
      finalContent = `${header}\n\n${newEntry}${rest}`;
    } else {
      finalContent = `# Changelog\n\n${newEntry}${existingContent}`;
    }

    await fs.writeFile(CHANGELOG_PATH, finalContent);
    logger.success(`Updated CHANGELOG.md with ${commits.length} commits.`);
  } catch (error) {
    logger.error("Failed to generate changelog: " + error.message);
    process.exit(1);
  }
}

main().catch(console.error);
