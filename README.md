<div align="center">

# 🚀 yeet

**Yeet your code to production.**  
_AI-powered git CLI for smart commits, pipelines, and PRs._

[![npm](https://img.shields.io/npm/v/yeet-git.svg)](https://www.npmjs.com/package/yeet-git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Flash-blueviolet.svg)](https://deepmind.google/technologies/gemini/)

[Installation](#-installation) • [Quick Start](#-quick-start) • [Commands](#-commands) • [Documentation](./docs/README.md)

</div>

---

## ✨ Why yeet?

Writing commit messages is boring. **yeet** uses Google's Gemini AI to understand your changes and generate semantic commit messages instantly.

But it doesn't stop there. **yeet** features a **Pipeline Engine** for complex git operations (like merging `dev` → `staging` → `main`) in one command.

---

## 📦 Installation

```bash
npm install -g yeet-git
```

Or install from source:

```bash
git clone https://github.com/samad-scs/yeet-git.git
cd yeet-git && npm install && npm link
```

> **Note:** PR features require the [GitHub CLI (`gh`)](https://cli.github.com/).

---

## 🚀 Getting Started

After installation, run:

```bash
yeet
```

On first run, you'll be prompted for your **Gemini API key**.

> 🔑 Get your **free key** at [Google AI Studio](https://makersuite.google.com/app/apikey).

Alternatively, set it manually in a `.env` file:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
```

---

## ⚡ Quick Start

```bash
# Interactive mode (recommended for first time)
yeet

# AI-powered commit
yeet --c

# Commit and push
yeet --c --p

# Merge to dev and push
yeet --to-dev --merge

# Deploy: dev → staging → main
yeet --to-dev-staging-main --merge
```

---

## 📚 Commands

| Command                        | Description                               |
| ------------------------------ | ----------------------------------------- |
| `yeet`                         | Interactive mode with wizard              |
| `yeet --c`                     | AI commit (stages all, generates message) |
| `yeet --c --yes`               | Auto-commit without confirmation          |
| `yeet --p`                     | Push current branch                       |
| `yeet --to-[branches] --merge` | Chain merges (e.g., `--to-dev-staging`)   |
| `yeet --to-[branches] --label` | Chain + create PR on final step           |
| `yeet init`                    | Setup GitHub auth                         |

---

## 🛠️ Utilities

Run `yeet` → **Utilities** for:

- 🌐 Open GitHub repo in browser
- 🔄 Toggle confirmation prompts
- 📋 View/Reset configuration
- 📝 Generate AI changelog

---

## 📖 Documentation

See the **[docs folder](./docs/README.md)** for detailed guides.

---

<div align="center">
  <p><i>Stop writing commit messages. Start shipping.</i></p>
</div>
