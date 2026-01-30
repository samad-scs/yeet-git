---
name: referencing-project-context
description: Loads the 'yeet-git' project details, core functionalities, and architectural context into memory. Use when the user asks about the project scope, or at the start of a session to ground the agent.
---

# Project Context: Yeet Git (yeet)

## When to use this skill

- When the user asks "What does this project do?", "What is the context?", or "Overview".
- When starting a new coding session to align with the core goals (AI Commit Generation, Git Workflow Automation).
- When you need to understand the relationship between `bin/yeet.js`, `src/core/engine.js`, and `src/services/git.js`.
- When deciding where to place new logic.

## Project Overview

**yeet-git** (CLI command: `yeet`) is a Node.js-based CLI tool designed to automate and enhance git workflows using AI. It leverages Google's Gemini AI to generate meaningful, Conventional Commits-compliant commit messages based on staged changes.

## Core Functionalities

### 1. AI-Powered Commit Generation

- **Intelligent Analysis**: Analyzes git diffs of staged files.
- **Conventional Commits**: Generates messages like `feat:`, `fix:`, `chore:`.
- **Large Changeset Handling**: Optimizes and summaries large diffs to fit token limits.
- **Interactive Review**: User confirms generated messages.

### 2. Comprehensive Git Workflow Automation

- **Smart Staging**: `--add-and-push` (or `-cp`) flag stages and pushes files.
- **Branch Synchronization**:
  - `syncLocalWithDev`: Fetches/merges `origin/dev`.
  - `pushCurrentBranch`: Pushes to remote, sets upstream.
- **PR & Merge Automation**:
  - **To Dev**: Creates PR merging feature -> `dev`. Auto-merges if checks pass.
  - **To Staging**: Promotes `dev` -> `staging`. Handles duplicate PRs.

### 3. Interactive CLI Experience

- Built with `@clack/prompts`.
- Supports "Yes mode" (`--yes`) for automation.
- Interactive Pipeline Wizard for custom workflows.
- Update Checker for new versions.

## Architecture & File Structure

```
/
├── bin/
│   └── yeet.js             # CLI Entry point. Error handling. Execute main.
├── package.json            # 'yeet' bin config.
└── src/
    ├── commands/
    │   ├── init.js         # Initialization logic.
    │   ├── interactive.js  # Interactive mode wizard.
    │   └── strategies.js   # Execution strategies (Commit, Push, PR).
    ├── core/
    │   ├── config.js       # Configuration management.
    │   ├── constants.js    # Static constants.
    │   ├── engine.js       # Core logic. Orchestrates pipelines.
    │   ├── logger.js       # Logging utility.
    │   ├── parser.js       # Argument parsing.
    │   ├── storage.js      # Local storage for pipelines.
    │   └── update-checker.js # Version update notification.
    └── services/
        ├── ai.js           # Gemini API interaction.
        ├── git.js          # Git CLI wrappers.
        └── github.js       # GitHub API interaction.
```

## Key Dependencies

- **@clack/prompts**: UI (spinners, inputs).
- **@google/genai**: Gemini 2.0 Flash client.
- **execa**: Command execution.
- **dotenv**: Environment variable management.

## Configuration

- **Env**: `GEMINI_API_KEY`, `PR_LABELS_ENABLED` in `.env`.
- **Git**: Uses standard git config and `gh` CLI.
