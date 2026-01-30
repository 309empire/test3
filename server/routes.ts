import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { users, profiles, badges, tracks } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  registerObjectStorageRoutes(app);

  // Auto-seed admin
  const adminUsername = "Owner";
  const existingAdmin = await storage.getUserByUsername(adminUsername);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("owner11", 10);
    const [user] = await db.insert(users).values({
      username: adminUsername,
      password: hashedPassword,
      email: "admin@example.com",
      role: "owner",
    }).returning();
    
    await db.insert(profiles).values({
      userId: user.id,
      displayName: "Owner",
      bio: "Platform Owner",
    });
  }

  // Admin: Databank
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role === "user") return res.sendStatus(403);
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  });

  app.patch("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role === "user") return res.sendStatus(403);
    const { role, badges: userBadges, maxTracks, maxTags } = req.body;
    const [updated] = await db.update(users)
      .set({ role, badges: userBadges, maxTracks, maxTags })
      .where(eq(users.id, parseInt(req.params.id)))
      .returning();
    res.json(updated);
  });

  // Tracks API
  app.get("/api/tracks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userTracks = await db.select().from(tracks).where(eq(tracks.userId, (req.user as any).id));
    res.json(userTracks);
  });

  app.post("/api/tracks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    const currentTracks = await db.select().from(tracks).where(eq(tracks.userId, user.id));
    if (currentTracks.length >= (user.maxTracks || 3)) {
      return res.status(400).send("Max tracks reached");
    }
    const [newTrack] = await db.insert(tracks).values({ ...req.body, userId: user.id }).returning();
    res.json(newTrack);
  });

  app.delete("/api/tracks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await db.delete(tracks).where(sql`${tracks.id} = ${parseInt(req.params.id)} AND ${tracks.userId} = ${(req.user as any).id}`);
    res.sendStatus(200);
  });

  // Admin: Badges
  app.get("/api/badges", async (_req, res) => {
    const allBadges = await db.select().from(badges);
    res.json(allBadges);
  });

  app.post("/api/admin/badges", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role === "user") return res.sendStatus(403);
    const [newBadge] = await db.insert(badges).values(req.body).returning();
    res.json(newBadge);
  });

  app.patch("/api/admin/badges/:id", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role === "user") return res.sendStatus(403);
    const [updated] = await db.update(badges)
      .set(req.body)
      .where(eq(badges.id, parseInt(req.params.id)))
      .returning();
    res.json(updated);
  });

  // Profile
  app.get("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, (req.user as any).id));
    res.json(profile || null);
  });

  app.patch("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).id;
    
    // Ensure profile exists
    const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    if (!existing) {
      await db.insert(profiles).values({ userId });
    }

    const [updated] = await db.update(profiles)
      .set(req.body)
      .where(eq(profiles.userId, userId))
      .returning();
    res.json(updated);
  });

  // Object Storage proxy or direct upload could be here
  // But usually, App Storage is handled via the blueprint's provided logic.
  // We'll add a simple upload endpoint if needed, but App Storage usually
  // provides a client-side library or a direct API.
  // For this request, we'll assume the blueprint adds the necessary storage handling.

  // Public Profile
  app.get("/api/public/profile/:username", async (req, res) => {
    const [user] = await db.select().from(users).where(sql`LOWER(${users.username}) = LOWER(${req.params.username})`);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    let [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id));
    
    if (!profile) {
      [profile] = await db.insert(profiles).values({ userId: user.id }).returning();
    }
    
    // IP-based view tracking
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipString = Array.isArray(ip) ? ip[0] : ip || 'unknown';
    
    const existingView = await db.execute(sql`SELECT id FROM view_logs WHERE user_id = ${user.id} AND ip_address = ${ipString} LIMIT 1`);

    if (existingView.rows.length === 0) {
      await db.execute(sql`INSERT INTO view_logs (user_id, ip_address) VALUES (${user.id}, ${ipString})`);
      await db.update(users).set({ views: (user.views || 0) + 1 }).where(eq(users.id, user.id));
    }
    
    res.json({ user, profile });
  });

  const httpServer = createServer(app);
  return httpServer;
}
