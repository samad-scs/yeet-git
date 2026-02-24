# Architecture & Mental Model

yeet-git is designed as a modular CLI tool to automate git workflows with AI.

## Directory Structure

```text
/
├── bin/
│   └── yeet.js             # CLI Entry point. Handles errors and starts engine.
├── src/
│   ├── commands/           # Specific command implementations (init, interactive, etc.)
│   ├── core/               # Main orchestration logic (engine, config, parser).
│   └── services/           # External service wrappers (AI/Gemini, Git, GitHub).
```

## Key Components

### Entry Point (`bin/yeet.js`)
Handles process-level concerns like arg parsing and error logging. It delegatess work to the `engine`.

### Core Engine (`src/core/engine.js`)
The central orchestrator. It manages the execution pipelines, such as the sequence for generating a commit message and optionally pushing it.

### AI Service (`src/services/ai.js`)
Encapsulates communication with Google's Gemini API. It handles prompt construction and diff summarization to ensure accuracy within token limits.

### Git Service (`src/services/git.js`)
Wraps raw `git` commands using `execa` to provide a clean, promise-based API for the rest of the application.

### GitHub Service (`src/services/github.js`)
Interacts with the GitHub CLI (`gh`) and API to manage PRs, labels, and status checks.
