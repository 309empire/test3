import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Users Table ---
// Handles authentication, roles, and global stats
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // user, admin, owner
  joinDate: timestamp("join_date").defaultNow(),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  maxTracks: integer("max_tracks").default(3),
  maxTags: integer("max_tags").default(5),
  badges: jsonb("badges").$type<string[]>().default([]),
});

// --- Profiles Table ---
// Handles the visual customization of the user's page
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  displayName: text("display_name").default(""),
  bio: text("bio").default(""),
  location: text("location").default(""),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  backgroundUrl: text("background_url"),
  musicUrl: text("music_url"),

  // Display Options (Toggles)
  showViews: boolean("show_views").default(true),
  showUid: boolean("show_uid").default(true),
  showJoinDate: boolean("show_join_date").default(true),
  showWatermark: boolean("show_watermark").default(true),

  // Visual Styling
  themeColor: text("theme_color").default("#F97316"),
  backgroundEffect: text("background_effect").default("none"), // particles, rain, snow, etc

  // Reveal Screen Settings
  revealEnabled: boolean("reveal_enabled").default(false),
  revealText: text("reveal_text").default("Click to reveal"),
});

// --- Badges Table ---
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(), // emoji or svg path
  color: text("color").notNull().default("#F97316"),
});

// --- Tracks Table ---
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0),
});

// --- Zod Schemas for Validation ---
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  joinDate: true, 
  views: true, 
  createdAt: true,
  badges: true
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ 
  id: true, 
  userId: true 
});

export const insertBadgeSchema = createInsertSchema(badges).omit({ 
  id: true 
});

// --- Types ---
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Badge = typeof badges.$inferSelect;
export type Track = typeof tracks.$inferSelect;