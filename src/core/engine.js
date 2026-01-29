import { logger } from "./logger.js";
import parser from "./parser.js";
import { strategies } from "../commands/strategies.js";
import git from "../services/git.js";

class WorkflowEngine {
  constructor() {
    this.context = {
      flags: {
        yes: false,
      },
    };
  }

  async parse(args) {
    // Check for global flags first
    if (args.includes("--yes") || args.includes("-y")) {
      this.context.flags.yes = true;
    }

    // Pass args to Parser
    this.pipeline = await parser.parse(
      args.filter((a) => a !== "--yes" && a !== "-y"),
    );
    return this;
  }

  async execute(manualPipeline = null) {
    const pipelineToExecute = manualPipeline || this.pipeline;

    if (!pipelineToExecute || pipelineToExecute.length === 0) {
      logger.warn("No actions detected.");
      return;
    }

    logger.box(
      "Pipeline Execution",
      pipelineToExecute.map((step) => {
        const desc = step.target
          ? `${step.type}: ${step.source} -> ${step.target}`
          : `${step.type}: ${step.branch || "Current"}`;
        return desc;
      }),
    );

    let initialBranch;
    try {
      initialBranch = await git.getCurrentBranch();
    } catch (error) {
      logger.debug(`Could not determine initial branch: ${error.message}`);
    }

    try {
      for (const step of pipelineToExecute) {
        try {
          // Inject global flags into step options if needed
          const stepContext = { ...step, globalFlags: this.context.flags };
          await strategies[step.type](stepContext);
        } catch (error) {
          logger.error(
            `Pipeline failed at step ${step.type}: ${error.message}`,
          );
          throw error;
        }
      }

      logger.success("Pipeline completed successfully!");
    } finally {
      if (initialBranch) {
        try {
          const current = await git.getCurrentBranch();
          if (current !== initialBranch) {
            logger.info(`Reverting to original branch: ${initialBranch}`);
            await git.checkout(initialBranch);
          }
        } catch (error) {
          logger.warn(`Failed to revert to original branch: ${error.message}`);
        }
      }
    }
  }
}

export default new WorkflowEngine();
