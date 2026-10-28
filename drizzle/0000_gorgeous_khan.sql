CREATE TABLE `portfolio_content` (
	`id` text PRIMARY KEY NOT NULL,
	`published` text NOT NULL,
	`draft` text,
	`revision` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_owner` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL
);
