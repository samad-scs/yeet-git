# Examples & Recipes

Here are common real-world scenarios and how to handle them with `sc`.

## 1. The "WIP" Saver

You want to checkpoint your work before heading to lunch, but don't want to think of a message.

```bash
git add .
sc --c --yes
```

_Result: Automatically generates a descriptive message based on your half-finished work and commits it immediately._

## 2. The Feature Deploy

You have finished `feat/user-auth`. You need to get it onto the `dev` server for testing.

```bash
# Ensure you are on your feature branch
git checkout feat/user-auth

# Merge to dev and push automatically
sc --to-dev --merge
```

## 3. The Full Release Cycle

It's release day. You need to sync `dev` changes to `staging` for final QA, and then to `main` for production.

```bash
# Assuming you are starting from the dev branch or have just merged to it
sc --to-dev-staging-main --merge
```

_Note: If `main` is protected, this might fail on the final push. See recipe #4._

## 4. Protected Main Branch (PR Mode)

Your organization requires Pull Requests for changes to `main`. You have changes in `dev` that need to go live.

```bash
git checkout dev
sc --to-main --label
```

_Result: Creates a Pull Request from `dev` to `main` using the GitHub API, applying a deployment label._

## 5. Hotfix Propagation

You fixed a critical bug on a `hotfix/login-crash` branch. It needs to go everywhere immediately.

```bash
# Merge to dev, then staging, then open PR to main
sc --to-dev-staging-main --label
```

## 6. Keeping Branches in Sync

You notice `staging` is behind `dev`.

```bash
git checkout dev
sc --to-staging --merge
```
