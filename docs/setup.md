# Setup & Installation

## Prerequisites

To use **yeet**, you need the following tools installed:

- **Node.js**: Version 18 or higher is required. [Download Node.js](https://nodejs.org/)
- **Git**: Ensure Git is installed and configured in your environment.
- **GitHub CLI (`gh`)**: Required for PR creation features (`--label`). [Installation Guide](https://cli.github.com/)
- **Gemini API Key**: You'll need a Google Gemini API key to power the AI features.

## Installation

### Option 1: npm (Recommended)

```bash
npm install -g yeet-git
```

### Option 2: From Source

```bash
git clone https://github.com/samad-scs/auto-commit.git
cd auto-commit
npm install
npm link
```

After installation, the `yeet` command is available globally.

## Configuration

The application uses environment variables for configuration.

### Quick Start (.env)

Create a `.env` file in your project directory:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### Global Configuration (Shell Profile)

For a smoother experience, add the API key to your shell profile (e.g., `.zshrc`, `.bashrc`):

**For Zsh (macOS/Linux):**

```bash
echo 'export GEMINI_API_KEY=your_actual_api_key_here' >> ~/.zshrc
source ~/.zshrc
```

**For Bash:**

```bash
echo 'export GEMINI_API_KEY=your_actual_api_key_here' >> ~/.bashrc
source ~/.bashrc
```

### Additional Configuration

You can configure the AI model:

```bash
export AI_MODEL_NAME=gemini-1.5-pro # Optional: Defaults to gemini-2.0-flash
```
