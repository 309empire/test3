import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Use path.join for more robust path resolution
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
   * FIX: Changed from "*" to "/:path*" to satisfy path-to-regexp v8+ requirements.
   * This captures all remaining GET requests and serves index.html.
   */
  app.get("/:path*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"), (err) => {
      if (err) {
        // Handle cases where index.html might be missing during a request
        res.status(500).send("Error loading index.html");
      }
    });
  });
}
