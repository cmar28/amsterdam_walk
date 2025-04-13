import { pgTable, text, serial, integer, boolean, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tour data schema
export const tourStops = pgTable("tour_stops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  kidsContent: text("kids_content"),
  orderNumber: integer("order_number").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  audioUrl: text("audio_url"),
  duration: text("duration"), // Expected time to spend at this stop
  nextStopWalkingTime: text("next_stop_walking_time"),
  walkingTip: text("walking_tip"),
  images: json("images").$type<string[]>().default([]),
});

export const insertTourStopSchema = createInsertSchema(tourStops).omit({
  id: true,
});

export type InsertTourStop = z.infer<typeof insertTourStopSchema>;
// Explicitly define TourStop type to avoid issues with type inference
export type TourStop = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  kidsContent: string | null;
  orderNumber: number;
  latitude: number;
  longitude: number;
  audioUrl: string | null;
  duration: string | null;
  nextStopWalkingTime: string | null;
  walkingTip: string | null;
  images: string[];
};

// Coordinates for the walking route paths between stops
export const routePaths = pgTable("route_paths", {
  id: serial("id").primaryKey(),
  fromStopId: integer("from_stop_id").notNull(),
  toStopId: integer("to_stop_id").notNull(),
  coordinates: json("coordinates").$type<{lat: number, lng: number}[]>().notNull(),
});

export const insertRoutePathSchema = createInsertSchema(routePaths).omit({
  id: true,
});

export type InsertRoutePath = z.infer<typeof insertRoutePathSchema>;
// Explicitly define RoutePath type to avoid issues with type inference
export type RoutePath = {
  id: number;
  fromStopId: number;
  toStopId: number;
  coordinates: { lat: number; lng: number; }[];
};
