import { logger } from "./logger.js";
import parser from "./parser.js";
import { strategies } from "../commands/strategies.js";

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

    for (const step of pipelineToExecute) {
      try {
        // Inject global flags into step options if needed
        const stepContext = { ...step, globalFlags: this.context.flags };
        await strategies[step.type](stepContext);
      } catch (error) {
        logger.error(`Pipeline failed at step ${step.type}: ${error.message}`);
        process.exit(1);
      }
    }

    logger.success("Pipeline completed successfully!");
  }
}

export default new WorkflowEngine();
