---
name: publishing-package
description: Analyzes git history to determine the next version, generates a changelog, commits changes, and publishes the package to npm. Use when the user asks to "publish" or "release" the package.
---

# Publishing Package

## When to use this skill

- User asks to "publish package"
- User asks to "release new version"
- User mentions "npm publish"

## Workflow

1.  **Analyze Changes**: The script checks commits since the last tag.
2.  **Bump Version**: Determines if it's a major, minor, or patch release (based on Conventional Commits) and runs `npm version`.
3.  **Update Changelog**: Runs `maintaining-changelog` skill to update `CHANGELOG.md`.
4.  **Commit & Push**: Commits the version bump and changelog, then pushes tags.
5.  **Publish**: Runs `npm publish`.

## Instructions

Run the following script:

```bash
node .agent/skills/publishing-package/scripts/publish.js
```

## Resources

- [scripts/publish.js](scripts/publish.js)
