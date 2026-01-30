# 🎮 Interactive Mode Guide

**yeet** includes a powerful interactive mode for complex Git workflows.

Enter interactive mode by running without arguments:

```bash
yeet
```

---

## ✨ Features

### 1. ⚡️ Pipeline Wizard

Create custom git workflows on the fly:

- **Branch Selection**: Choose source and target branches interactively
- **Action Chaining**: Chain multiple actions (Merge, PR) together
- **Save for Later**: Save pipelines for instant reuse

### 2. 📂 Saved Pipelines

Manage frequently used workflows:

- **Run**: Execute a saved pipeline instantly
- **View Steps**: Inspect pipeline before running
- **Delete**: Remove unused pipelines

> [!TIP]
> Run saved pipelines from command line:
>
> ```bash
> yeet <pipeline-name>
> ```

### 3. Commit Actions

- **Commit**: Auto-generate commit message with AI
- **Commit & Push**: One-step commit and push
- **Push Only**: Push current commits

### 4. Utilities

- 🌐 Open GitHub repo
- 🔄 Toggle confirmations
- 📋 View/Reset config
- 📝 Generate AI changelog
- 🔑 Update API Key

---

## 🚀 Example: Creating a Pipeline

1. Run `yeet` → **Pipeline Wizard**
2. Select **Start Branch** (e.g., `main`)
3. Select **Target Branch** (e.g., `staging`)
4. Choose action (e.g., **Create PR**)
5. Save with a name like `deploy-stage`
6. Next time, just run: `yeet deploy-stage`

Happy yeeting! 🚀
