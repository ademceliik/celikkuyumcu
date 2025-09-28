-- Migration: Initial schema creation
-- Created: 2024-01-01

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"weight" numeric(5,2) NOT NULL,
	"gold_karat" integer NOT NULL,
	"image_url" text NOT NULL,
	"is_active" text DEFAULT 'true' NOT NULL,
	"has_workmanship" text DEFAULT 'true' NOT NULL
);

-- Contact info table
CREATE TABLE IF NOT EXISTS "contact_info" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"working_hours" text NOT NULL
);

-- About info table
CREATE TABLE IF NOT EXISTS "about_info" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"experience_years" integer NOT NULL,
	"customer_count" integer NOT NULL,
	"image_url" text NOT NULL
);

-- Homepage info table
CREATE TABLE IF NOT EXISTS "homepage_info" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"message" text NOT NULL,
	"created_at" text DEFAULT now() NOT NULL,
	"is_read" text DEFAULT 'false' NOT NULL
);

-- Exchange rate table
CREATE TABLE IF NOT EXISTS "exchange_rate" (
	"id" text PRIMARY KEY NOT NULL,
	"currency" text NOT NULL,
	"rate" numeric(10,4) NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_unique" ON "users" ("username");
CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" ("category");
CREATE INDEX IF NOT EXISTS "products_is_active_idx" ON "products" ("is_active");
CREATE INDEX IF NOT EXISTS "messages_is_read_idx" ON "messages" ("is_read");
CREATE UNIQUE INDEX IF NOT EXISTS "exchange_rate_currency_unique" ON "exchange_rate" ("currency");
