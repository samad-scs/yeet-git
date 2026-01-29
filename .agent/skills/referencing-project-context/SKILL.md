---
name: referencing-project-context
description: Loads the 'sweet-commit' project details, core functionalities, and architectural context into memory. Use when the user asks about the project scope, or at the start of a session to ground the agent.
---

# Project Context: Sweet Commit (sc)

## When to use this skill

- When the user asks "What does this project do?", "What is the context?", or "Overview".
- When starting a new coding session to align with the core goals (AI Commit Generation, Git Workflow Automation).
- When you need to understand the relationship between `index.js`, `src/main.js`, `src/git.js`, and `src/utils.js`.
- When deciding where to place new logic (Git vs AI vs Core).

## Project Overview

**sweet-commit** (CLI command: `sc`) is a Node.js-based CLI tool designed to automate and enhance git workflows using AI. It leverages Google's Gemini AI to generate meaningful, Conventional Commits-compliant commit messages based on staged changes.

## Core Functionalities

### 1. AI-Powered Commit Generation

- **Intelligent Analysis**: Analyzes git diffs of staged files.
- **Conventional Commits**: Generates messages like `feat:`, `fix:`, `chore:`.
- **Large Changeset Handling**: Optimizes and summarizes large diffs to fit token limits.
- **Interactive Review**: User confirms generated messages.

### 2. Comprehensive Git Workflow Automation

- **Smart Staging**: `--add-and-push` flag stages all files.
- **Branch Synchronization**:
  - `syncLocalWithDev`: Fetches/merges `origin/dev`.
  - `pushCurrentBranch`: Pushes to remote, sets upstream.
- **PR & Merge Automation**:
  - **To Dev**: Creates PR merging feature -> `dev`. Auto-merges if checks pass.
  - **To Staging**: Promotes `dev` -> `staging`. Handles duplicate PRs.

### 3. Interactive CLI Experience

- Built with `@clack/prompts`.
- Supports "Yes mode" (`--yes`) for automation.

## Architecture & File Structure

```
/
├── index.js          # Entry point. Error handling. Execute main.
├── package.json      # 'sc' bin config.
└── src/
    ├── main.js       # Core logic. Argument parsing. Orchestrates Workflow (Commit -> Sync -> PR).
    ├── git.js        # Git & GitHub CLI wrappers. Low-level 'git'/'gh' execution.
    ├── utils.js      # AI & Data processing. Gemini API interaction. Diff parsing.
    └── config.js     # Constants (token limits, buffer sizes).
```

## Key Dependencies

- **@clack/prompts**: UI (spinners, inputs).
- **@google/genai**: Gemini 2.0 Flash client.
- **clipboardy**: Clipboard ops.
- **open**: Open URLs.

## Configuration

- **Env**: `GEMINI_API_KEY` in `.env`.
- **Git**: Uses standard git config and `gh` CLI.
