import { execa } from "execa";
import { logger } from "../core/logger.js";

class GitService {
  constructor(cwd = process.cwd()) {
    this.cwd = cwd;
  }

  async run(args, options = {}) {
    try {
      // Use plumbing commands where possible or explicit simplified output
      const { stdout } = await execa("git", args, {
        cwd: this.cwd,
        ...options,
      });
      return stdout.trim();
    } catch (error) {
      // Clean up error message
      throw new Error(
        `Git command failed: git ${args.join(" ")}\n${error.message}`,
      );
    }
  }

  async getBranches() {
    const output = await this.run(["branch", "--format", "%(refname:short)"]);
    return output
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);
  }

  async getCurrentBranch() {
    return this.run(["symbolic-ref", "--short", "HEAD"]);
  }

  async hasChanges() {
    const status = await this.run(["status", "--porcelain"]);
    return status.length > 0;
  }

  async stageAll() {
    await this.run(["add", "."]);
  }

  async commit(message) {
    await this.run(["commit", "-m", message]);
  }

  async push(remote = "origin", branch) {
    const current = branch || (await this.getCurrentBranch());
    try {
      await this.run(["push", remote, current]);
    } catch (e) {
      // Handle no upstream
      if (e.message.includes("steps to push")) {
        await this.run(["push", "--set-upstream", remote, current]);
      } else {
        throw e;
      }
    }
  }

  async checkout(branch, create = false) {
    const args = ["checkout"];
    if (create) args.push("-b");
    args.push(branch);
    await this.run(args);
  }

  async merge(branch) {
    await this.run(["merge", branch]);
  }

  async getDiff(staged = true) {
    const args = ["diff"];
    if (staged) args.push("--staged");
    return this.run(args);
  }

  // Plumbing: Get raw status for logic
  async getStatus() {
    return this.run(["status", "--porcelain"]);
  }

  async getDiffBetweenBranches(source, target) {
    // Get the diff of commits between source and target
    return this.run(["diff", `${target}...${source}`]);
  }
}

export default new GitService();
