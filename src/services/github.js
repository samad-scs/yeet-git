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

  async login() {
    // Run gh auth login - this is an interactive process
    // We use stdio: inherit to allow user interaction in the terminal
    try {
      await execa("gh", ["auth", "login"], { stdio: "inherit" });
    } catch (error) {
      throw new Error(`GitHub login failed: ${error.message}`);
    }
  }

  async checkAuth() {
    try {
      const { stdout } = await execa("gh", ["auth", "status"]);
      return stdout.includes("Logged in to github.com");
    } catch (error) {
      return false;
    }
  }

  async getRepoUrl() {
    try {
      await this.checkInstalled();
      const { stdout } = await execa("gh", [
        "repo",
        "view",
        "--json",
        "url",
        "-q",
        ".url",
      ]);
      return stdout.trim();
    } catch (error) {
      throw new Error(`Could not get repository URL: ${error.message}`);
    }
  }

  async openRepo() {
    try {
      await this.checkInstalled();
      // gh browse opens the repo in the default browser
      await execa("gh", ["browse"]);
    } catch (error) {
      throw new Error(`Could not open repository: ${error.message}`);
    }
  }
}

export default new GitHubService();
