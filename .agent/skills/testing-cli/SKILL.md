---
name: testing-cli
description: Tests the auto-commit CLI tool by performing file edits and running various git command scenarios to verify functionality. Use when the user asks to test the CLI commands.
---

# Testing Auto-Commit CLI

## When to use this skill

- When the user asks to "test the CLI" or "verify commands".
- When you need to ensure the `sc` tool is working correctly after changes.
- To validate specific git workflows supported by the tool.

## Workflow

1.  **Setup Work Area**: Create or verify existence of a simple text file (e.g., `test_playground.txt`) in the root directory.
2.  **Iterative Testing**: For each test case:
    - Modify the `test_playground.txt` file (append a timestamp or random string) to ensure git detects a change.
    - Run the specific `sc` command.
    - Verify the output and git status.
3.  **Cleanup**: Optionally revert changes to `test_playground.txt` or leave it for history.

## Test Commands Checklist

Copy this checklist to `task.md` or use it to track your progress.

### Basic Operations

- [ ] `sc --c`
  - _Goal_: Commit current changes with AI-generated message.
  - _Expectation_: `git add .` runs, AI generates message, commit is created.
- [ ] `sc --c --p`
  - _Goal_: Commit and Push.
  - _Expectation_: Same as above, plus `git push`.

### Merge Flows (Dev)

- [ ] `sc --to-dev --merge`
  - _Goal_: Merge current branch into `dev`.
  - _Expectation_: Switch to `dev`, merge original branch.

### Multi-Stage Flows (Staging)

- [ ] `sc --to-dev-staging --label`
  - _Goal_: Merge to dev, then PR to staging with static label.
  - _Expectation_: Current -> Dev (Merge) -> Staging (PR/NoMerge + Label).
- [ ] `sc --to-dev-staging --merge`
  - _Goal_: Merge to dev, then merge to staging.
  - _Expectation_: Current -> Dev (Merge) -> Staging (Merge).
- [ ] `sc --to-dev-staging --merge --label-[MyLabel]`
  - _Goal_: Merge to dev, merge to staging with custom label.
  - _Expectation_: Current -> Dev (Merge) -> Staging (Merge + Label=MyLabel).

### Full Pipeline (Main)

- [ ] `sc --to-dev-staging-main --merge`
  - _Goal_: Propagation to Dev, Staging, and Main.
  - _Expectation_: Current -> Dev (Merge) -> Staging (Merge) -> Main (Merge).

## Instructions

- **Safe Execution**: Always check `git status` before running these commands to know where you are.
- **Modifications**: The `test_playground.txt` file is your sandbox. Don't modify critical project files for these tests.
- **Extending Tests**: Add new command variations to this list as the project evolves and new flags are implemented.
- **Command Alias**: If `sc` is not in the global path, use `node ./bin/scom.js` or the appropriate relative path to the binary.
