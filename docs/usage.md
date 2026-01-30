# Usage Guide

The `yeet` CLI automates git operations using AI. It simplifies committing changes, managing branches, and creating pull requests.

## Core Commands

### AI Commit (`--c`)

Analyzes staged changes, generates a conventional commit message using AI.

```bash
yeet --c
```

**Workflow:**

1. **Stage Files**: Run `git add <files>` first.
2. **Run Command**: Execute `yeet --c`.
3. **Review**: The CLI shows the generated message.
4. **Confirm**: Type `y` to commit, or `n` to cancel.

### Skipping Confirmation (`--yes`)

Skip the confirmation prompt:

```bash
yeet --c --yes
```

### Push (`--p`)

Push the current branch to remote:

```bash
yeet --p
```

---

## Pipeline Workflows (`--to`)

`yeet` features a powerful "Pipeline Engine" for automating merges across multiple branches.

### Single Merge

Merge your **current branch** into a target branch:

```bash
# Merge current -> dev
yeet --to-dev --merge
```

### Multi-Hop Pipelines

Chain multiple merges in a single command:

```bash
# Merge current -> dev, then merge dev -> staging
yeet --to-dev-staging --merge
```

```bash
# Merge current -> dev -> staging -> main
yeet --to-dev-staging-main --merge
```

### Creating Pull Requests (`--label`)

When you can't push directly to protected branches, use `--label` to create a PR instead:

```bash
# Merge current -> dev, then create a PR from dev -> main
yeet --to-dev-main --label
```

---

## Flag Reference

| Flag             | Description                                               |
| :--------------- | :-------------------------------------------------------- |
| `--c`            | **Commit**. Generates AI message and commits.             |
| `--p`            | **Push**. Pushes current branch to origin.                |
| `-cp`            | **Commit & Push**. Shortcut for commit and push.          |
| `--to-[targets]` | Defines the pipeline structure. E.g., `--to-dev-staging`. |
| `--merge`        | **Action**. Executes the pipeline using direct merges.    |
| `--label`        | **Action**. Executes pipeline, ending with a PR.          |
| `--yes` / `-y`   | **Config**. Skips all confirmation prompts.               |
