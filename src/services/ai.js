import { GoogleGenAI } from "@google/genai";
import { CONFIG } from "../core/config.js";
import { logger } from "../core/logger.js";

class AIService {
  constructor() {
    if (CONFIG.GEMINI_API_KEY) {
      this.client = new GoogleGenAI({ apiKey: CONFIG.GEMINI_API_KEY });
    } else {
      logger.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
    }
  }

  /**
   * Generates a commit message based on the provided diff.
   * @param {string} diff
   * @returns {Promise<string>}
   */
  async generateCommitMessage(diff) {
    if (!this.client) throw new Error("AI is not initialized");
    if (!diff) throw new Error("No diff provided for content generation");

    const prompt = `
      You are an expert developer. Generate a commit message following the Conventional Commits specification.
      The message should be concise, descriptive, and follow the format:
      <type>(<scope>): <description>

      [optional body]

      [optional footer]

      Rules:
      - Use types: feat, fix, chore, docs, style, refactor, perf, test, build, ci, revert.
      - Keep the first line under 72 characters.
      - If the diff looks like a work-in-progress or empty, return "wip: work in progress".
      - Return ONLY the commit message, no markdown code blocks.

      Diff:
      ${diff.slice(0, CONFIG.MAX_TOKENS * 3)} // Rough char limit to avoid context error
    `;

    try {
      const response = await this.client.models.generateContent({
        model: CONFIG.MODEL_NAME,
        contents: prompt,
      });

      let text = "";
      if (
        response.candidates &&
        response.candidates.length > 0 &&
        response.candidates[0].content &&
        response.candidates[0].content.parts &&
        response.candidates[0].content.parts.length > 0
      ) {
        text = response.candidates[0].content.parts[0].text;
      }

      // Clean up if model adds backticks
      text = text.replace(/^```(git|commit)?\n/, "").replace(/\n```$/, "");
      return text.trim();
    } catch (error) {
      logger.error("Failed to generate commit message: " + error.message);
      throw error;
    }
  }

  /**
   * Generates a PR description based on the diff between branches.
   * @param {string} diff
   * @param {string} source
   * @param {string} target
   * @returns {Promise<string>}
   */
  async generatePRDescription(diff, source, target) {
    if (!this.client) throw new Error("AI is not initialized");

    const prompt = `
      You are an expert developer. Generate a detailed Pull Request description for merging branch "${source}" into "${target}".
      
      The description should include:
      1. A brief summary of the changes (2-3 sentences).
      2. A bullet list of key changes (if there are multiple).
      3. Any notable considerations for reviewers.
      
      Rules:
      - Keep it professional and concise.
      - Use markdown formatting.
      - If the diff is empty or minimal, just write "Minor changes or updates."
      - Return ONLY the description, no extra commentary.
      
      Diff:
      ${diff.slice(0, CONFIG.MAX_TOKENS * 3)}
    `;

    try {
      const response = await this.client.models.generateContent({
        model: CONFIG.MODEL_NAME,
        contents: prompt,
      });

      let text = "";
      if (
        response.candidates &&
        response.candidates.length > 0 &&
        response.candidates[0].content &&
        response.candidates[0].content.parts &&
        response.candidates[0].content.parts.length > 0
      ) {
        text = response.candidates[0].content.parts[0].text;
      }

      return text.trim() || "Automated PR created by sc CLI.";
    } catch (error) {
      logger.warn("Failed to generate PR description: " + error.message);
      return "Automated PR created by sc CLI.";
    }
  }
}

export default new AIService();
