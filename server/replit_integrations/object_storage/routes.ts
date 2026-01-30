import type { Express } from "express";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

/**
 * Register object storage routes for file uploads.
 */
export function registerObjectStorageRoutes(app: Express): void {
  const objectStorageService = new ObjectStorageService();

  /**
   * Request a presigned URL for file upload.
   */
  app.post("/api/uploads/request-url", async (req, res) => {
    try {
      const { name, size, contentType } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name",
        });
      }

      // Force image/png if it's an image
      const forcedContentType = contentType.startsWith('image/') ? 'image/png' : contentType;

      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

      res.json({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType: forcedContentType },
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  /**
   * Serve uploaded objects.
   * Using a named parameter for the path to handle multi-segment paths in Express 5
   */
  app.get("/objects/:objectPath", async (req, res) => {
    try {
      const objectPath = req.params.objectPath;
      if (!objectPath) {
        return res.status(400).json({ error: "Missing object path" });
      }

      // Reconstruct the full path for getObjectEntityFile
      // Ensure we don't double the prefix
      const fullPath = objectPath.startsWith("/objects/") ? objectPath : `/objects/${objectPath}`;
      const objectFile = await objectStorageService.getObjectEntityFile(fullPath);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      return res.status(500).json({ error: "Failed to serve object" });
    }
  });
}
