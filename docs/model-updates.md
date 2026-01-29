# Updating the AI Model

By default, `auto-commit` uses the **Gemini 2.0 Flash** model for fast and efficient generation. However, you may want to use a more capable model (like Pro) or a newer version as it becomes available.

## Method 1: Environment Variable (Recommended)

The easiest way to change the model is by setting the `AI_MODEL_NAME` environment variable. This requires no code changes.

**In your `.env` file:**

```ini
AI_MODEL_NAME=gemini-1.5-pro
```

**Or in your shell:**

```bash
export AI_MODEL_NAME=gemini-1.5-pro
```

## Method 2: Source Code Configuration

If you want to change the default model for all users of your fork, you can modify the source code configuration.

1.  Open the file `src/core/config.js`.
2.  Locate the `MODEL_NAME` property in the `CONFIG` object.

```javascript
// src/core/config.js

const CONFIG = {
  // ... other config

  // Update the default string here
  MODEL_NAME: process.env.AI_MODEL_NAME || "gemini-2.0-flash",

  // ...
};
```

3.  Change `"gemini-2.0-flash"` to your desired model identifier (e.g., `"gemini-1.5-pro-latest"`).

## Customizing Prompts

To change _how_ the AI generates commit messages (e.g., to enforce a specific team style or add emojis), you can modify the prompt logic.

1.  Open `src/services/ai.js`.
2.  Locate the `generateCommitMessage` method.
3.  Edit the `prompt` template literal string.

```javascript
// src/services/ai.js

const prompt = `
  You are an expert developer...
  // Your custom instructions here
`;
```
