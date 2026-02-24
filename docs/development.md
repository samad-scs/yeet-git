# Development Guide

This guide is intended for developers who want to contribute to the yeet-git codebase.

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/samad-scs/yeet-git.git
   cd yeet-git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Running in development**
   You can run the CLI directly from the source using:
   ```bash
   node bin/yeet.js
   ```

4. **Linking for global use**
   If you want to test the `yeet` command globally while developing:
   ```bash
   npm link
   ```

## Development Workflow

- **Branching**: Create a feature branch for your changes (`feat/your-feature-name`).
- **Coding Standards**: Follow the rules defined in [AGENT.md](../AGENT.md). We prefer clean, modular code with clear separation between core logic and external services.
- **Testing**: We currently rely on manual verification. Ensure you test your changes across various git scenarios (staging, committing, pushing, PR creation).

## Project Structure

Refer to [Architecture & Mental Model](./architecture.md) for details on how the codebase is organized.
