# yeet-git — Project Rules

## 1. Type Safety & Code Quality

- `strict: true` — no exceptions in TypeScript (if applicable)
- Zero `any` — use `unknown` and narrow
- Conventional Commits enforced for all changes

## 2. API Design & CLI Standards

- Uses `@clack/prompts` for all user interaction
- CLI commands should be idempotent where possible
- Errors must be user-friendly and actionable
- Support `--yes` flag for non-interactive automation

## 3. Git & GitHub Integration

- All git operations via `src/services/git.js` (execa wrapper)
- All GitHub operations via `src/services/github.js`
- Respect `.gitignore` and `gh` CLI credentials

## 4. Dependencies

- Prefer minimal, high-quality dependencies
- No direct usage of `child_process` — use `execa`
- Lazy-load heavy dependencies if possible to keep CLI startup fast

## 5. Versioning & Changelog

- SemVer for releases
- Keep `CHANGELOG.md` updated with every release
- Update version in `package.json` before publishing

## 6. Optimization

- Optimize LLM prompts for accuracy and token efficiency
- Summarize large diffs before sending to Gemini API
- Keep CLI response times low
