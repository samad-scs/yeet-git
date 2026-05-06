<div align="center">

# 🚀 yeet

**Yeet your code to production.**  
_AI-powered git CLI for smart commits, pipelines, and PRs._

[![npm](https://img.shields.io/npm/v/yeet-git.svg)](https://www.npmjs.com/package/yeet-git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%203%20Flash-blueviolet.svg)](https://deepmind.google/technologies/gemini/)

</div>

---

## ⚡ Quick Install

```bash
npm install -g yeet-git
```

Then run the setup wizard:

```bash
yeet init
```

The wizard will guide you through:

1. 📦 Installing GitHub CLI (if needed)
2. 🔐 Logging into GitHub
3. 🔑 Setting up your Gemini API key

---

## 🎯 Daily Usage

```bash
# Interactive mode (recommended)
yeet

# AI-powered commit
yeet --c

# Commit and push
yeet -cp

# Merge to dev
yeet --to-dev --merge

# Full deploy: dev → staging → main
yeet --to-dev-staging-main --merge
```

---

## 📋 Commands

| Command                 | What it does       |
| ----------------------- | ------------------ |
| `yeet`                  | Interactive wizard |
| `yeet --c`              | AI commit          |
| `yeet -cp`              | Commit + Push      |
| `yeet --to-dev --merge` | Merge to dev       |
| `yeet --to-X-Y --label` | Chain + PR         |
| `yeet init`             | Setup wizard       |

---

## 🔄 Update to Latest

```bash
npm update -g yeet-git
```

---

## 📖 Full Documentation

For advanced usage, pipelines, and configuration:

👉 **[Read the Docs](./docs/README.md)**

---

<div align="center">
  <p><i>Stop writing commit messages. Start shipping.</i></p>
</div>
