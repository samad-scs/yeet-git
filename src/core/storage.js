import fs from "fs/promises";
import path from "path";
import { CONSTANTS } from "./constants.js";

const STORAGE_DIR = CONSTANTS.STORAGE.DIR;
const STORAGE_FILE = CONSTANTS.STORAGE.PIPELINES_FILE;

async function ensureStorage() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }

  try {
    await fs.access(STORAGE_FILE);
  } catch {
    await fs.writeFile(STORAGE_FILE, JSON.stringify({}, null, 2));
  }
}

async function loadPipelines() {
  await ensureStorage();
  try {
    const data = await fs.readFile(STORAGE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export const pipelineStorage = {
  async getAll() {
    return await loadPipelines();
  },

  async get(name) {
    const pipelines = await loadPipelines();
    return pipelines[name];
  },

  async save(name, pipeline) {
    const pipelines = await loadPipelines();
    pipelines[name] = pipeline;
    await fs.writeFile(STORAGE_FILE, JSON.stringify(pipelines, null, 2));
  },

  async delete(name) {
    const pipelines = await loadPipelines();
    if (pipelines[name]) {
      delete pipelines[name];
      await fs.writeFile(STORAGE_FILE, JSON.stringify(pipelines, null, 2));
      return true;
    }
    return false;
  },
};
