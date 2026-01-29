import { GoogleGenerativeAI } from "@google/genai";
import { CONFIG } from "../core/config.js";
import { logger } from "../core/logger.js";

class AIService {
  constructor() {
    if (CONFIG.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: CONFIG.MODEL_NAME });
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
    if (!this.genAI) throw new Error("AI is not initialized");
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
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      // Clean up if model adds backticks
      text = text.replace(/^```(git|commit)?\n/, "").replace(/\n```$/, "");
      return text.trim();
    } catch (error) {
      logger.error("Failed to generate commit message: " + error.message);
      throw error;
    }
  }
}

export default new AIService();
