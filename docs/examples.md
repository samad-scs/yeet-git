# Examples & Recipes

Here are common real-world scenarios and how to handle them with `yeet`.

## 1. The "WIP" Saver

Checkpoint your work without thinking of a message:

```bash
git add .
yeet --c --yes
```

_Result: Auto-generates a descriptive message and commits immediately._

## 2. The Feature Deploy

Finished `feat/user-auth` and need to get it onto `dev`:

```bash
git checkout feat/user-auth
yeet --to-dev --merge
```

## 3. The Full Release Cycle

Sync `dev` → `staging` → `main` for production:

```bash
yeet --to-dev-staging-main --merge
```

## 4. Protected Main Branch (PR Mode)

Your organization requires PRs for `main`:

```bash
git checkout dev
yeet --to-main --label
```

_Result: Creates a Pull Request from `dev` to `main`._

## 5. Hotfix Propagation

Critical bug fix needs to go everywhere:

```bash
# Merge to dev, staging, then PR to main
yeet --to-dev-staging-main --label
```

## 6. Keeping Branches in Sync

Sync `staging` with `dev`:

```bash
git checkout dev
yeet --to-staging --merge
```
