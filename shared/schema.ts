import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Country schema
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  capital: text("capital").notNull(),
  population: integer("population").notNull(),
  color: text("color").notNull(),
  region: text("region"),
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

// Timeline events schema
export const politicalEvents = pgTable("political_events", {
  id: serial("id").primaryKey(),
  countryCode: text("country_code").notNull(),
  period: text("period").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  partyColor: text("party_color"),
  partyName: text("party_name"),
  tags: jsonb("tags").$type<string[]>(),
  order: integer("order").notNull(),
});

export const insertPoliticalEventSchema = createInsertSchema(politicalEvents).omit({
  id: true,
});

// Type definitions
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

export type InsertPoliticalEvent = z.infer<typeof insertPoliticalEventSchema>;
export type PoliticalEvent = typeof politicalEvents.$inferSelect;

// For frontend use - full country with events
export type CountryWithEvents = Country & {
  events: PoliticalEvent[];
};
