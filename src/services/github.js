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
      const { stdout } = await execa("gh", args);
      return stdout.trim();
    } catch (error) {
      // Check if PR already exists
      if (error.stderr.includes("already exists")) {
        return "PR already exists";
      }
      throw error;
    }
  }
}

export default new GitHubService();
