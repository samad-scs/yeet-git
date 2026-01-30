# 🎮 Interactive Mode Guide

The **auto-commit** CLI (`sc`) comes with a powerful interactive mode designed to simplify complex Git workflows.

To enter interactive mode, simply run the command without any arguments:

```bash
sc
```

---

## ✨ Features Overview

### 1. ⚡️ Pipeline Wizard (Dynamic)

Create custom git workflows on the fly!

- **Branch Selection**: Choose your source and target branches interactively.
- **Action Chaining**: Chain multiple actions (Merge, Pull Request) together.
  - _Example_: `feature` -> `dev` (Merge) -> `staging` (PR).
- **Customization**: Add PR labels or other options during creation.
- **Save for Later**: At the end of the wizard, you can **save your pipeline** to reuse it instantly next time.

### 2. 📂 Saved Pipelines

Manage your frequently used workflows.

- **Run**: Execute a saved pipeline with a single click.
- **View Steps**: Inspect what a saved pipeline does before running it.
- **Delete**: Remove old or unused pipelines.

> [!TIP]
> You can also run a saved pipeline directly from the command line:
>
> ```bash
> sc <pipeline-name>
> ```

### 3. Commit Actions

Quick access to common tasks:

- **Commit**: Auto-generate a commit message using AI.
- **Commit & Push**: Commit and push changes in one go.
- **Push Only**: Push current commits to remote.

### 4. Utilities

- **Update API Key**: Easily rotate or update your Gemini API Key.

---

## 🚀 Example Workflow: Creating & Saving a Pipeline

1. Run `sc` and select **Pipeline Wizard**.
2. Select your **Start Branch** (e.g., `main`).
3. Select a **Target Branch** to merge into (e.g., `staging`).
4. Choose an action (e.g., **Create Pull Request**).
5. (Optional) Repeat if you want to chain more steps (e.g., merge `staging` into `prod`).
6. When finished, the wizard will ask: **"Save this pipeline for future use?"**
7. Select **Yes**, give it a name like `deploy-stage`.
8. Next time, just run: `sc deploy-stage`!

---

Happy Coding! 🚀
