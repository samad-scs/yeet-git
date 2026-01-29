import git from "../services/git.js";
import ai from "../services/ai.js";
import github from "../services/github.js";
import { logger } from "../core/logger.js";
import { CONSTANTS } from "../core/constants.js";
import { text, confirm, spinner } from "@clack/prompts";

export const strategies = {
  COMMIT: async (step) => {
    const s = spinner();
    s.start("Checking git status...");

    const hasChanges = await git.hasChanges();
    if (!hasChanges) {
      s.stop("No changes to commit.");
      return;
    }
    s.stop("Changes detected.");

    await git.stageAll();
    logger.step("Staged all files.");

    s.start("Generating commit message with AI...");
    const diff = await git.getDiff(true);
    const message = await ai.generateCommitMessage(diff);
    s.stop("Message generated.");

    let finalMessage = message;

    if (!step.globalFlags.yes) {
      const confirmed = await confirm({
        message: `Commit with: "${message}"?`,
      });
      if (!confirmed) {
        finalMessage = await text({
          message: "Enter commit message:",
          placeholder: "feat: ...",
          initialValue: message,
        });
        if (!finalMessage) throw new Error("Commit cancelled.");
      }
    }

    await git.commit(finalMessage);
    logger.success(`Committed: ${finalMessage}`);
  },

  PUSH: async (step) => {
    const s = spinner();
    const branch = step.branch || (await git.getCurrentBranch());
    s.start(`Pushing to ${branch}...`);
    await git.push(CONSTANTS.DEFAULTS.REMOTE, branch);
    s.stop("Push complete.");
    logger.success("Changes pushed to remote.");
  },

  MERGE: async (step) => {
    const { source, target } = step;
    logger.info(`Merging ${source} into ${target}...`);

    if (await git.hasChanges()) {
      logger.error(
        "Working directory has uncommitted changes. Please commit or stash them before merging.",
      );
      process.exit(1);
    }

    // 1. Checkout target
    await git.checkout(target);

    // 2. Pull latest (ignore if remote branch doesn't exist)
    try {
      await git.run(["pull", CONSTANTS.DEFAULTS.REMOTE, target]);
    } catch (e) {
      if (!e.message.includes("couldn't find remote ref")) {
        logger.warn(`Pull failed: ${e.message}`);
      }
    }

    // 3. Merge source
    try {
      await git.merge(source);
      logger.success(`Merged ${source} into ${target}`);

      // 4. Push target (Implicit push for pipeline flow)
      await git.push(CONSTANTS.DEFAULTS.REMOTE, target);
      logger.success(`Pushed ${target}`);
    } catch (error) {
      logger.error("Merge conflict or error. Aborting.");
      await git.run(["merge", "--abort"]).catch(() => {});
      await git.checkout(source);
      throw error;
    }
  },

  PR: async (step) => {
    const { source, target, options } = step;
    const s = spinner();

    // Ensure source is pushed
    if (await git.hasChanges()) {
      logger.error(
        "Working directory has uncommitted changes. Please commit or stash them before switching branches.",
      );
      process.exit(1);
    }
    await git.checkout(source);
    await git.push(CONSTANTS.DEFAULTS.REMOTE, source);

    logger.info(`Creating PR: ${source} -> ${target}`);

    try {
      const url = await github.createPR({
        title: `Merge ${source} to ${target}`,
        body: `Automated PR created by sc CLI.`,
        base: target,
        head: source,
        label: options.label,
      });
      logger.success(`PR Created: ${url}`);
    } catch (e) {
      logger.warn(`PR Creation failed (or exists): ${e.message}`);
    }
  },
};
