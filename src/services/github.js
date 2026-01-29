import { execa } from "execa";

class GitHubService {
  async createPR({ title, body, base, head, label }) {
    const args = [
      "pr",
      "create",
      "--title",
      title,
      "--body",
      body,
      "--base",
      base,
      "--head",
      head,
    ];
    if (label) {
      args.push("--label", label);
    }

    // Needs 'gh' CLI installed
    try {
      await this.checkInstalled();
      const { stdout } = await execa("gh", args);
      return stdout.trim();
    } catch (error) {
      if (error.message.includes("GitHub CLI (gh) is not installed")) {
        throw error;
      }
      // Check if PR already exists
      if (error.stderr && error.stderr.includes("already exists")) {
        return "PR already exists";
      }
      throw error;
    }
  }

  async checkInstalled() {
    try {
      await execa("gh", ["--version"]);
    } catch (error) {
      throw new Error(
        "GitHub CLI (gh) is not installed. Please install it to use PR features.",
      );
    }
  }
}

export default new GitHubService();
