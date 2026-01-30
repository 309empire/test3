import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // 1. Serve static files (CSS, JS, Images)
  app.use(express.static(distPath));

  /**
   * 2. Fallback for SPA routes
   * Using /.*/ (a Regular Expression) instead of a string.
   * This is the "bulletproof" fix for Node 22 and path-to-regexp v8.
   */
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"), (err) => {
      if (err) {
        res.status(500).send("Error loading index.html");
      }
    });
  });
}
