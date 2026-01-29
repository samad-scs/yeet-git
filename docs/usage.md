# Usage Guide

The `sc` (Auto-Commit) CLI allows you to automate git operations using AI. It simplifies the process of committing changes, managing branches, and creating pull requests.

## Core Commands

### AI Commit (`--c`)

This is the primary command. It analyzes your currently staged changes, sends the diff to Google's Gemini AI, and generates a conventional commit message.

```bash
sc --c
```

**Workflow:**

1.  **Stage Files**: Run `git add <files>` first. `sc` only looks at staged changes.
2.  **Run Command**: Execute `sc --c`.
3.  **Review**: The CLI will show you the generated message.
4.  **Confirm**: Type `y` to commit, or `n` to cancel.

### Skipping Confirmation (`--yes`)

If you trust the AI implicitly (or are running in a script), you can skip the confirmation prompt.

```bash
sc --c --yes
```

### Push (`--p`)

Push the current branch to the remote repository.

```bash
sc --p
```

---

## Pipeline Workflows (`--to`)

`sc` features a powerful "Pipeline Engine" that allows you to automate merging across multiple branches. This is defined using the `--to` flag.

### Single Merge

Merge your **current branch** into a target branch.

```bash
# Merge current -> dev
sc --to-dev --merge
```

### Multi-Hop Pipelines

Chain multiple merges together in a single command.

```bash
# Merge current -> dev, then merge dev -> staging
sc --to-dev-staging --merge
```

```bash
# Merge current -> dev, then dev -> staging, then staging -> main
sc --to-dev-staging-main --merge
```

### Creating Pull Requests (`--label`)

Often, you cannot push directly to production branches like `main` or `master`. In these cases, use the `--label` action.

This executes the pipeline as usual, but the **final step** creates a GitHub Pull Request instead of a direct merge.

```bash
# Merge current -> dev, then create a PR from dev -> main
sc --to-dev-main --label
```

- **Note**: The `--label` flag applies a default label (e.g., "Deployment") to the PR.

---

## Flag Reference

| Flag             | Short | Description                                               |
| :--------------- | :---- | :-------------------------------------------------------- |
| `--c`            | -     | **Commit**. Generates AI message and commits.             |
| `--p`            | -     | **Push**. Pushes current branch to origin.                |
| `--to-[targets]` | -     | Defines the pipeline structure. E.g., `--to-dev-staging`. |
| `--merge`        | -     | **Action**. Executes the pipeline using direct merges.    |
| `--label`        | -     | **Action**. Executes pipeline, ending with a PR.          |
| `--yes`          | `-y`  | **Config**. Skips all confirmation prompts.               |
