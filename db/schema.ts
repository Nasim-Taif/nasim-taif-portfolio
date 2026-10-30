import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const portfolioContent = pgTable("portfolio_content", {
  id: text("id").primaryKey(),
  published: text("published").notNull(),
  draft: text("draft"),
  revision: integer("revision").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const portfolioOwner = pgTable("portfolio_owner", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
});
