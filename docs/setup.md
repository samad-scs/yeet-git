# Setup & Installation

## Prerequisites

To use **Auto Commit (sc)**, you need the following tools installed:

- **Node.js**: Version 18 or higher is required. [Download Node.js](https://nodejs.org/)
- **Git**: Ensure Git is installed and configured in your environment.
- **Gemini API Key**: You'll need a Google Gemini API key to power the AI features.

## Installation

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/samad-scs/auto-commit.git
cd auto-commit
```

### 2. Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

### 3. Link Globally (Recommended)

Linking the package globally allows you to run the `sc` command from any directory on your system, making it a true daily driver for your git workflow.

```bash
npm link
```

After this, you can type `sc` in any terminal window.

## Configuration

The application uses environment variables for configuration. You need to set your Gemini API key.

### Quick Start (.env)

Create a `.env` file in the root of the auto-commit project directory:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### Global Configuration (Shell Profile)

For a smoother experience across all your projects, we recommend adding the API key to your shell's profile (e.g., `.bashrc`, `.zshrc`, or `.profile`).

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

You can also configure the AI model used by setting the `AI_MODEL_NAME` environment variable.

```bash
export AI_MODEL_NAME=gemini-1.5-pro # Optional: Defaults to gemini-2.0-flash
```
