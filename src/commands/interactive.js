import { cancel, confirm, isCancel, select, text } from "@clack/prompts";
import { setConfig } from "../core/config.js";
import { CONSTANTS } from "../core/constants.js";
import engine from "../core/engine.js";
import { logger } from "../core/logger.js";
import git from "../services/git.js";
import { pipelineStorage } from "../core/storage.js";

export const interactive = {
  main: async () => {
    // Basic main menu
    const action = await select({
      message: "Interactive Mode",
      options: [
        { value: "wizard", label: "⚡️ Pipeline Wizard (Dynamic)" },
        { value: "saved", label: "📂 Saved Pipelines" },
        { value: "commit", label: "Commit Actions" },
        { value: "utils", label: "Utilities" },
      ],
    });

    if (isCancel(action)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    if (action === "commit") {
      const args = await interactive.commitMenu();
      if (args) {
        await engine.parse(args);
        await engine.execute();
      }
      return;
    }

    if (action === "utils") {
      await interactive.utilsMenu();
      return;
    }

    if (action === "wizard") {
      await interactive.pipelineWizard();
      return;
    }

    if (action === "saved") {
      await interactive.savedPipelinesMenu();
      return;
    }
  },

  commitMenu: async () => {
    // Reuse existing logic or simple menu
    const action = await select({
      message: "Commit Actions",
      options: [
        { value: ["--c"], label: "Commit (Auto-generate message)" },
        { value: ["--c", "--p"], label: "Commit & Push" },
        { value: ["--p"], label: "Push Only" },
      ],
    });
    if (isCancel(action)) {
      cancel("Cancelled");
      process.exit(0);
    }
    return action;
  },

  pipelineWizard: async () => {
    // 1. Get Branches
    const branches = await git.getBranches();
    const currentBranch = await git.getCurrentBranch();

    // Helper to select branch
    const selectBranch = async (message, exclude = []) => {
      const options = branches
        .filter((b) => !exclude.includes(b))
        .map((b) => ({ value: b, label: b }));

      options.unshift({ value: "MANUAL_INPUT", label: "Type Manually..." });

      const selection = await select({
        message,
        options,
      });
      if (isCancel(selection)) {
        cancel("Cancelled");
        process.exit(0);
      }

      if (selection === "MANUAL_INPUT") {
        const val = await text({ message: "Enter branch name:" });
        if (isCancel(val)) {
          cancel("Cancelled");
          process.exit(0);
        }
        return val;
      }
      return selection;
    };

    const pipeline = [];
    let currentSource = currentBranch;

    // confirm start
    const startChoice = await select({
      message: `Start from branch ${currentSource}?`,
      options: [
        { value: currentSource, label: `Yes (Current: ${currentSource})` },
        { value: "OTHER", label: "No, choose another start branch" },
      ],
    });
    if (isCancel(startChoice)) {
      cancel("Cancelled");
      process.exit(0);
    }

    if (startChoice === "OTHER") {
      currentSource = await selectBranch("Select Start Branch");
    }

    // Loop builder
    let addingSteps = true;
    while (addingSteps) {
      const target = await selectBranch(`Merge ${currentSource} into?`, [
        currentSource,
      ]);

      const type = await select({
        message: `Action for ${currentSource} -> ${target}?`,
        options: [
          { value: "MERGE", label: "Merge & Push" },
          { value: "PR", label: "Create Pull Request" },
        ],
      });
      if (isCancel(type)) {
        cancel("Cancelled");
        process.exit(0);
      }

      let options = {};
      if (type === "PR") {
        const label = await text({
          message: "PR Label (optional):",
          placeholder: "Deployment",
          defaultValue: CONSTANTS.PR_DEFAULT_LABEL,
        });
        if (isCancel(label)) {
          cancel("Cancelled");
          process.exit(0);
        }
        if (label) options.label = label;
      }

      pipeline.push({
        type,
        source: currentSource,
        target,
        branch: target, // Engine uses target for merge/pr, branch logic usually for commit/push.
        // Wait, engine logic (strategies.js):
        // MERGE: uses step.source and step.target
        // PR: uses step.source and step.target
        options,
      });

      // Check if we should continue
      // If PR, usually it's the end of a chain? Not necessarily, but common.
      // Let's ask.
      const more = await confirm({
        message: "Add another step to this pipeline?",
      });
      if (isCancel(more)) {
        cancel("Cancelled");
        process.exit(0);
      }

      if (more) {
        currentSource = target;
      } else {
        addingSteps = false;
      }
    }

    // Execute
    if (pipeline.length > 0) {
      logger.info("Generated Pipeline:");
      console.log(pipeline);

      const save = await confirm({
        message: "Save this pipeline for future use?",
      });
      if (save && !isCancel(save)) {
        const name = await text({
          message:
            "Enter a name for this pipeline (e.g. deploy-stag) to run it later with 'sc <name>':",
          placeholder: "deploy-stag",
          validate: (value) => {
            if (!value) return "Name is required";
            if (value.includes(" ")) return "No spaces allowed";
          },
        });
        if (name && !isCancel(name)) {
          await pipelineStorage.save(name, pipeline);
          logger.success(`Pipeline saved! Run it with: sc ${name}`);
        }
      }
      const run = await confirm({ message: "Run this pipeline?" });
      if (run && !isCancel(run)) {
        await engine.execute(pipeline);
      }
    }
  },

  utilsMenu: async () => {
    const action = await select({
      message: "Utilities",
      options: [{ value: "config", label: "Update API Key" }],
    });
    if (isCancel(action)) {
      cancel("Cancelled");
      process.exit(0);
    }

    if (action === "config") {
      const apiKey = await text({
        message: "Enter new GenAI API Key",
        placeholder: "AI...",
      });
      if (!isCancel(apiKey) && apiKey) {
        await setConfig("GEMINI_API_KEY", apiKey);
        logger.success("API Key updated.");
      }
    }
  },

  savedPipelinesMenu: async () => {
    const pipelines = await pipelineStorage.getAll();
    const keys = Object.keys(pipelines);

    if (keys.length === 0) {
      logger.warn("No saved pipelines found.");
      return;
    }

    const selectedName = await select({
      message: "Select a Pipeline",
      options: [
        ...keys.map((k) => ({ value: k, label: k })),
        { value: "BACK", label: `${keys?.length + 1}. Back to Main Menu` },
      ],
    });

    if (isCancel(selectedName) || selectedName === "BACK") {
      return interactive.main();
    }

    // Action Menu for Selected Pipeline
    const action = await select({
      message: `Action for '${selectedName}'?`,
      options: [
        { value: "RUN", label: "1. Run Pipeline" },
        { value: "VIEW", label: "2. View Steps" },
        { value: "DELETE", label: "3. Delete Pipeline" },
        { value: "BACK", label: "4. Back to List" },
      ],
    });

    if (isCancel(action) || action === "BACK") {
      return interactive.savedPipelinesMenu();
    }

    const pipeline = pipelines[selectedName];

    if (action === "RUN") {
      await engine.execute(pipeline);
    } else if (action === "VIEW") {
      logger.info(`Steps for ${selectedName}:`);
      pipeline.forEach((step, idx) => {
        const desc = step.target
          ? `${step.type}: ${step.source} -> ${step.target}`
          : `${step.type}: ${step.branch || "Current"}`;
        console.log(`  ${idx + 1}. ${desc}`);
        if (step.options && Object.keys(step.options).length > 0) {
          console.log(`     Options: ${JSON.stringify(step.options)}`);
        }
      });
      // Wait for user to read?
      await confirm({ message: "Press Enter to continue..." });
      return interactive.savedPipelinesMenu();
    } else if (action === "DELETE") {
      const sure = await confirm({
        message: `Are you sure you want to delete '${selectedName}'?`,
      });
      if (sure && !isCancel(sure)) {
        await pipelineStorage.delete(selectedName);
        logger.success(`Deleted '${selectedName}'`);
      }
      return interactive.savedPipelinesMenu();
    }
  },
};
