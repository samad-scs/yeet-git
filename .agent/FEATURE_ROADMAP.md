# SC CLI - Feature Roadmap

This document outlines planned features for the `sc` (auto-commit) CLI tool. Reference any feature by its ID when requesting implementation.

---

## Quick Reference

| ID  | Feature                             | Priority | Ease | Status |
| --- | ----------------------------------- | :------: | :--: | :----: |
| F01 | Dry Run Mode                        |   🥇 1   | 🥇 1 |   ⬜   |
| F02 | Project-Level Config                |   🥈 2   | 🥈 2 |   ⬜   |
| F03 | Pipeline History/Logs               |   🥉 3   | 🥉 3 |   ⬜   |
| F04 | Status Dashboard                    |    4     |  4   |   ⬜   |
| F05 | Branch Protection Warnings          |    5     |  5   |   ⬜   |
| F06 | Team Sharing (Export/Import)        |    6     |  6   |   ⬜   |
| F07 | Pipeline Templates                  |    7     |  8   |   ⬜   |
| F08 | Interactive Diff Viewer             |    8     |  7   |   ⬜   |
| F09 | AI-Powered PR Descriptions          |    9     |  9   |   ✅   |
| F10 | Commit Message with History Context |    10    |  10  |   ⬜   |
| F11 | Undo Last Action                    |    11    |  11  |   ⬜   |
| F12 | Notifications/Webhooks              |    12    |  12  |   ⬜   |
| F13 | Scheduled Pipelines / Git Hooks     |    13    |  13  |   ⬜   |
| F14 | Multi-Repo Support                  |    14    |  14  |   ⬜   |
| F15 | Smart Conflict Resolution Hints     |    15    |  15  |   ⬜   |

**Legend**: ⬜ Planned | 🔄 In Progress | ✅ Done

---

## Feature Details

### F01: Dry Run Mode

**Category**: Quality of Life  
**Complexity**: Low  
**Description**: Add a `--dry-run` flag that simulates pipeline execution without making actual git changes. Outputs what _would_ happen.

**Implementation Notes**:

- Add `dryRun` flag to `engine.execute()`.
- Each strategy logs actions instead of executing them when `dryRun` is true.
- Works for both CLI args (`sc --dry-run --to-staging --merge`) and saved pipelines (`sc my-pipe --dry-run`).

---

### F02: Project-Level Config

**Category**: Configuration  
**Complexity**: Low-Medium  
**Description**: Support a `.scrc` or `sc.config.json` file in the project root for project-specific settings and pipelines, separate from global `~/.auto-commit/`.

**Implementation Notes**:

- Check for `.scrc` in `process.cwd()` before falling back to global config.
- Merge project config with global (project takes precedence).
- Use cases: project-specific API keys, default branches, team-shared pipelines.

---

### F03: Pipeline History/Logs

**Category**: Developer Experience  
**Complexity**: Low  
**Description**: Log executed pipelines with timestamps to `~/.auto-commit/history.json`. Users can view past runs for auditing/debugging.

**Implementation Notes**:

- After `engine.execute()`, append entry: `{ pipeline, timestamp, status, branch }`.
- Add `sc history` command to view recent runs (last 10).
- Optional: `sc history --clear` to reset.

---

### F04: Status Dashboard

**Category**: Developer Experience  
**Complexity**: Low  
**Description**: A quick `sc status` command showing current branch, uncommitted changes, stash count, and pending actions.

**Implementation Notes**:

- Use existing `git.js` service to gather info.
- Display in a formatted box (similar to `logger.box`).
- Show: branch, dirty files, last commit, remote sync status.

---

### F05: Branch Protection Warnings

**Category**: Safety  
**Complexity**: Low  
**Description**: Warn users before merging into protected branches (e.g., `main`, `prod`). Configurable list of protected branches.

**Implementation Notes**:

- Add `protectedBranches` array to config (default: `['main', 'master', 'prod', 'production']`).
- Before MERGE strategy executes, check if target is protected → prompt confirmation.

---

### F06: Team Sharing (Export/Import)

**Category**: Collaboration  
**Complexity**: Medium  
**Description**: Export saved pipelines to a shareable JSON/YAML file. Import pipelines from teammates.

**Implementation Notes**:

- `sc export <name> -o pipeline.json`
- `sc import pipeline.json`
- Validate imported structure before saving.

---

### F07: Pipeline Templates

**Category**: Workflow  
**Complexity**: Medium  
**Description**: Offer pre-built pipeline templates (GitFlow Deploy, Hotfix, Release) that users can import and customize.

**Implementation Notes**:

- Store templates in `src/templates/` or fetch from a remote JSON.
- Add "Use Template" option in Pipeline Wizard.
- Templates are just pre-configured pipelines with placeholders for branch names.

---

### F08: Interactive Diff Viewer

**Category**: Developer Experience  
**Complexity**: Medium  
**Description**: Before committing, show an interactive diff to let users select which files to stage.

**Implementation Notes**:

- Use `git diff --name-only` to list changed files.
- Use `@clack/prompts` multiselect to let user pick files.
- Stage only selected files before commit.

---

### F09: AI-Powered PR Descriptions

**Category**: AI Enhancements  
**Complexity**: Medium  
**Description**: When creating a Pull Request, use AI to generate a detailed description based on the diff.

**Implementation Notes**:

- Get diff between source and target branches.
- Pass to Gemini with prompt: "Generate a PR description for these changes."
- Use in `strategies.PR` before GitHub API call.

---

### F10: Commit Message with History Context

**Category**: AI Enhancements  
**Complexity**: Medium  
**Description**: Improve AI commit messages by analyzing recent commit history to match team style.

**Implementation Notes**:

- Fetch last 10 commits with `git log --oneline -10`.
- Include in AI prompt: "Match the style of these previous commits."
- Increases consistency across team.

---

### F11: Undo Last Action

**Category**: Safety  
**Complexity**: High  
**Description**: A quick way to revert the last pipeline step if something goes wrong.

**Implementation Notes**:

- Track git state (HEAD, branch) before each action.
- Store in `~/.auto-commit/undo-stack.json`.
- `sc undo` → restore previous state.
- Complex: handle merge commits, pushed changes, etc.

---

### F12: Notifications/Webhooks

**Category**: Integrations  
**Complexity**: High  
**Description**: Send notifications (Slack, Discord, email) after pipeline success/failure.

**Implementation Notes**:

- Add `notifications` config section with webhook URLs.
- After `engine.execute()`, POST to configured webhooks.
- Include: pipeline name, status, timestamp, branch info.

---

### F13: Scheduled Pipelines / Git Hooks

**Category**: Automation  
**Complexity**: High  
**Description**: Trigger saved pipelines on git events (e.g., run `deploy-stag` after push to `main`).

**Implementation Notes**:

- `sc hook install <event> <pipeline>` → writes to `.git/hooks/<event>`.
- Requires careful handling of hook scripts and permissions.
- Alternative: use `husky` integration.

---

### F14: Multi-Repo Support

**Category**: Advanced  
**Complexity**: Very High  
**Description**: Allow pipelines that span multiple repositories or specific packages in a monorepo.

**Implementation Notes**:

- Pipeline steps can specify `repo` or `package` field.
- Engine switches directories before executing.
- Requires significant architectural changes.

---

### F15: Smart Conflict Resolution Hints

**Category**: AI Enhancements  
**Complexity**: Very High  
**Description**: If a merge fails due to conflicts, use AI to suggest resolution strategies.

**Implementation Notes**:

- Detect merge conflict in `strategies.MERGE`.
- Extract conflicting hunks.
- Pass to AI: "Suggest how to resolve these conflicts."
- Experimental: may not always be accurate.

---

## Usage

To request implementation of any feature, simply say:

> "Implement F01" or "Let's work on Feature F03"

I will reference this document for context and proceed with planning.
