<div align="center">

# ⚡️ Auto Commit (scom)

**The intelligent CLI companion for the modern git workflow.**  
_Automate commits, streamline merges, and manage complex pipelines with a single command._

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Flash-blueviolet.svg)](https://deepmind.google/technologies/gemini/)

[Installation](#-installation) • [Configuration](#-configuration) • [The Workflow](#-the-workflow) • [Contributing](#-contributing)

</div>

---

## 🌟 Why scom?

Writing commit messages, switching branches, pulling, merging, and pushing... it allows us to build great things, but the process itself is repetitive. **Auto Commit (`scom`)** uses Google's Gemini AI to understand your code changes and generate semantic, meaningful commit messages instantly.

But it doesn't stop there. `scom` features a **Pipeline Engine** that lets you define complex git operations (like merging from `dev` -> `staging` -> `main`) in one semantic command.

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/samad-scs/auto-commit.git
cd auto-commit

# 2. Install dependencies
npm install

# 3. Link the CLI globally
npm link
```

Now, the `scom` (or `sc`) command is available system-wide!

---

## ⚙️ Configuration

Create a `.env` file in the root of your project (or set this in your shell's rc file).

```ini
GEMINI_API_KEY=your_google_ai_studio_key
```

> 🔑 **Get your key totally free** at [Google AI Studio](https://makersuite.google.com/app/apikey).

---

## 📚 The Workflow

`scom` scales from simple daily tasks to complex release engineering.

### Level 1: The Basics (Daily Driver)

The command you will use 90% of the time. Stages all changes, generates a commit message, and commits.

| Command            | Description                                                                  |
| :----------------- | :--------------------------------------------------------------------------- |
| **`sc --c`**       | **AI Commit.** Analyzes your diffs and prompts you with a generated message. |
| **`sc --c --yes`** | **Instant Commit.** Skips the confirmation prompt. Use with confidence!      |
| **`sc --p`**       | **Push.** Pushes the current branch to `origin`.                             |

### Level 2: The Multi-Hops (Pipelines)

Stop running `git checkout`, `git pull`, `git merge` manually. Tell `scom` where you want your code to go.

**Scenario: "I finished my feature. Merge it to dev."**

```bash
sc --to-dev --merge
```

_(This merges your **current** branch into `dev` and pushes `dev`)_

**Scenario: "Deploy to Staging."**

```bash
sc --to-staging --merge
```

### Level 3: Release Engineering (Chains)

The killer feature. Define a chain of merges in a single line.

**Scenario: "Sync my changes across the entire stack (Dev -> Staging -> Main)."**

```bash
sc --to-dev-staging-main --merge
```

_`scom` will:_

1. Merge `current` → `dev` & Push
2. Merge `dev` → `staging` & Push
3. Merge `staging` → `main` & Push

### Level 4: Pull Requests

When you want to merge into protected branches (like `main`), you usually need a PR.

**Scenario: "Merge to dev, then open a PR from dev to main."**

```bash
sc --to-dev-main --label
```

_`scom` will:_

1. Merge `current` → `dev` & Push
2. Open a GitHub PR from `dev` → `main`
3. Apply the default label "Deployment"

---

## 🛠️ CLI Reference

| Flag             | Category     | Actions                                                |
| :--------------- | :----------- | :----------------------------------------------------- |
| `--c`            | **Core**     | **Commit**. Stages files & AI commits.                 |
| `--p`            | **Core**     | **Push**. Pushes current branch.                       |
| `--to-[targets]` | **Pipeline** | Defines a chain. E.g. `--to-dev-staging`.              |
| `--merge`        | **Action**   | executes **merges** between the chain links.           |
| `--label`        | **Action**   | similar to merge, but the **final link** becomes a PR. |
| `-y` / `--yes`   | **Config**   | Skips confirmation prompts.                            |

---

<div align="center">
  <p><i>Building the future of coding, one commit at a time.</i></p>
</div>
