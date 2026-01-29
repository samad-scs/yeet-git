---
name: issue-resolver
description: Automated issue resolution skill. Parses a list of issues from a file and systematically applies fixes to the codebase. Use this when the user points to an issue list (e.g., ISSUES.md) and asks to fix them.
---

# Issue Resolver Skill

## When to use this skill

- When the user provides a markdown list of issues (bugs, feature requests, refactors).
- When the user asks to "fix the issues in ISSUES.md" or similar.
- To systematically address a backlog of small-to-medium tasks.

## Workflow

1.  **Read and Parse**:
    - Read the target issues file (default: `ISSUES.md`).
    - Parse the issues into a list (detecting headers or numbered lists).

2.  **Iterate and Resolve**:
    - For **EACH** issue in the list:
      - **Contextualize**: Read the files mentioned in the "Location" or description of the issue.
      - **Plan**: Formulate a brief plan to resolve the issue (e.g., "Add check for `gh` in `src/services/github.js`").
      - **Execute**: Apply code changes using `replace_file_content` or `multi_replace_file_content`.
      - **Verify**: If applicable, run `lint-and-validate` (if that skill is available and relevant) or simple verification commands.
      - **Update Status**: (Optional) Mark the issue as `[x]` in the original file to track progress.

3.  **Final Review**:
    - Report back which issues were resolved and any that required manual intervention.

## Instructions for the Agent

- **Autonomy**: You are expected to fix the code directly.
- **Safety**: If an issue description is vague, look for code comments or surrounding code to infer intent. If still unsure, skip and ask the user.
- **Dependencies**:
  - Use `lint-and-validate` skill after making changes to ensure no regressions.
  - Use `testing-cli` skill if the fix involves CLI behavior that can be tested via the playground.
- **Progress Tracking**: You can update the `ISSUES.md` file by changing numbered lists `1.` to `1. [x]` or adding a "Status: Resolved" line.

## Example Usage

**User**: "Fix the issues in ISSUES.md"

**Agent**:

1. calls `view_file` on `ISSUES.md`.
2. Identifies Issue 1: "Missing Configuration Prompt".
3. Reads `src/core/config.js` and `bin/sc.js`.
4. Modifies `bin/sc.js` to add a prompt using `@clack/prompts` if config is missing.
5. Marks Issue 1 as done.
6. Moves to Issue 2...
