import { logger } from "./logger.js";
import git from "../services/git.js";
import { CONSTANTS } from "./constants.js";
import { pipelineStorage } from "./storage.js";

class PipelineParser {
  constructor() {
    this.pipeline = [];
  }

  async parse(args) {
    const startBranch = await git.getCurrentBranch();
    let processingChain = false;
    let chainTargets = [];
    let currentSource = startBranch;

    // First pass: Identify actions
    // We treat --c and --p as immediate actions on the START branch
    // We treat --to-X as starting a chain

    // Check if it's a saved pipeline
    if (args.length === 1 && !args[0].startsWith("-")) {
      const saved = await pipelineStorage.get(args[0]);
      if (saved) {
        logger.info(`Loaded saved pipeline: ${args[0]}`);
        this.pipeline = saved;
        return this.pipeline;
      }
    }

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg === "--c") {
        this.pipeline.push({ type: "COMMIT", branch: startBranch });
      } else if (arg === "--p") {
        this.pipeline.push({ type: "PUSH", branch: startBranch });
      } else if (arg === "-cp") {
        this.pipeline.push({ type: "COMMIT", branch: startBranch });
        this.pipeline.push({ type: "PUSH", branch: startBranch });
      } else if (arg.startsWith("--to-")) {
        processingChain = true;
        // Parse chain: --to-dev-staging-main -> [dev, staging, main]
        const chainStr = arg.replace("--to-", "");
        chainTargets = chainStr.split("-");

        // We will finalize the chain items on the NEXT iterations or end
      } else if (arg === "--merge") {
        if (!processingChain) {
          // Standalone merge? "current -> merge". Ambiguous without target.
          logger.warn("Ignoring --merge without --to chain.");
        } else {
          // Apply MERGE to the ENTIRE chain?
          // Or just the last link?
          // User: "--to-dev-staging --merge : current->dev(merge)->staging(merge)"
          // So --merge implies "All links are Merges"
          this._buildChain(currentSource, chainTargets, "MERGE", {});
          processingChain = false; // Chain consumed
        }
      } else if (arg.startsWith("--label")) {
        const label = arg.startsWith("--label-")
          ? arg.replace("--label-", "")
          : CONSTANTS.PR_DEFAULT_LABEL;
        if (!processingChain) {
          logger.warn("Ignoring --label without --to chain.");
        } else {
          // User: "--to-dev-staging --label : current->dev(merge)->staging(PR)"
          // Implication: Intermediate links are MERGE, Last link is PR
          this._buildChain(currentSource, chainTargets, "PR", { label });
          processingChain = false;
        }
      } else if (arg === "--no-label") {
        if (processingChain) {
          this._buildChain(currentSource, chainTargets, "PR", { label: null });
          processingChain = false;
        }
      }
    }

    // Unconsumed chain? Default to MERGE or Warn?
    // User examples always show a terminator flag (--merge, --label).
    // If user does "yeet --to-dev", we should probably default to... git checkout? Or Merge?
    // Let's assume MERGE for safety if implicit.
    if (processingChain) {
      this._buildChain(currentSource, chainTargets, "MERGE", {});
    }

    return this.pipeline;
  }

  _buildChain(startSource, targets, finalAction, options) {
    let source = startSource;

    targets.forEach((target, index) => {
      const isLast = index === targets.length - 1;
      const type = isLast ? finalAction : "MERGE";

      // If it's a PR, we pass options. If Merge, usually no options needed.
      // BUT: Intermediate merges need to be robust.

      this.pipeline.push({
        type,
        source,
        target,
        options: isLast ? options : {},
      });

      source = target; // Next link starts from this target
    });
  }
}

export default new PipelineParser();
