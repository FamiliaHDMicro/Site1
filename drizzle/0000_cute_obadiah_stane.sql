CREATE TABLE `siteone_test_checkouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(80) NOT NULL,
	`businessName` varchar(80) NOT NULL,
	`planCode` varchar(48) NOT NULL,
	`menuItemCount` int NOT NULL,
	`amountCents` int NOT NULL,
	`status` enum('created','pending','approved','rejected','cancelled','error') NOT NULL DEFAULT 'created',
	`mercadoPagoPreferenceId` varchar(120),
	`mercadoPagoPaymentId` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteone_test_checkouts_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteone_test_checkouts_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
