import { execa } from "execa";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../../../../src/core/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = process.cwd();

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
  const args = ["log", "--pretty=format:%s|%b", "--no-merges"];
  if (sinceTag) args.push(range);

  try {
    const { stdout } = await execa("git", args);
    if (!stdout) return [];
    return stdout.split("\n").map((line) => {
      const parts = line.split("|");
      return { message: parts[0], body: parts.slice(1).join("|") };
    });
  } catch (error) {
    return [];
  }
}

async function determineBump(commits) {
  let type = "patch";
  for (const commit of commits) {
    if (
      commit.body.includes("BREAKING CHANGE") ||
      commit.message.includes("!:")
    ) {
      return "major";
    }
    if (commit.message.startsWith("feat")) {
      type = "minor";
    }
  }
  return type;
}

async function main() {
  logger.info("Starting publish process...");

  // 1. Analyze Changes
  const latestTag = await getLatestTag();
  const commits = await getCommits(latestTag);

  if (commits.length === 0) {
    logger.warn("No new commits found.");
    return;
  }

  const bumpType = await determineBump(commits);
  logger.info(`Determined version bump: ${bumpType}`);

  // 2. Bump Version
  try {
    await execa("npm", ["version", bumpType, "--no-git-tag-version"]);
    const pkg = JSON.parse(
      await fs.readFile(path.join(ROOT_DIR, "package.json"), "utf-8"),
    );
    logger.success(`Bumped version to ${pkg.version}`);

    // 3. Update Changelog
    const changelogScript = path.resolve(
      __dirname,
      "../../maintaining-changelog/scripts/update-changelog.js",
    );
    logger.info("Updating changelog...");
    await execa("node", [changelogScript], { stdio: "inherit" });

    // 4. Commit and Push
    logger.info("Committing release...");
    await execa("git", ["add", "."]);
    await execa("git", ["commit", "-m", `chore(release): v${pkg.version}`]);

    logger.info("Tagging...");
    await execa("git", ["tag", `v${pkg.version}`]);

    logger.info("Pushing...");
    await execa("git", ["push"]);
    await execa("git", ["push", "--tags"]);

    // 5. Publish
    logger.info("Publishing to npm...");
    await execa("npm", ["publish"], { stdio: "inherit" });

    logger.success(`Successfully published v${pkg.version}!`);
  } catch (error) {
    logger.error("Publish failed: " + error.message);
    process.exit(1);
  }
}

main().catch(console.error);
