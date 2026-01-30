---
name: maintaining-changelog
description: Generates and updates the project's CHANGELOG.md file based on git history and AI summarization. Use when the user asks to update the changelog or prepare release notes.
---

# Maintaining Changelog

## When to use this skill

- User asks to "update changelog"
- User asks to "generate release notes"
- User is preparing a release and needs a summary of changes
- User asks "what changed since the last version?"

## Workflow

1.  **Check for existing changelog**: Verify if `CHANGELOG.md` exists.
2.  **Run the update script**: Execute the provided node script to fetch commits and append to the changelog.
3.  **Review**: Ask the user to review the generated entries.

## Instructions

Run the following script to update the changelog:

```bash
node .agent/skills/maintaining-changelog/scripts/update-changelog.js
```

## Resources

- [scripts/update-changelog.js](scripts/update-changelog.js)
  - Node.js script that:
    1. Finds the latest git tag.
    2. Fetches commits since that tag (or all commits if no tag).
    3. Uses the project's AI service to format the changes.
    4. Prepends the new entry to `CHANGELOG.md`.
