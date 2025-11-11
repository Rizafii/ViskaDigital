-- Step 1: Create tables
-- This script creates the database schema needed for the application

-- DROP existing tables if needed (uncomment if you want to recreate)
-- DROP TABLE IF EXISTS "creator_data" CASCADE;
-- DROP TABLE IF EXISTS "twibone_used" CASCADE;
-- DROP TABLE IF EXISTS "link_click" CASCADE;
-- DROP TABLE IF EXISTS "link" CASCADE;
-- DROP TABLE IF EXISTS "twibone" CASCADE;
-- DROP TABLE IF EXISTS "users" CASCADE;
-- DROP TABLE IF EXISTS "role" CASCADE;

-- Create role table with auto-increment
CREATE TABLE IF NOT EXISTS "role"(
    "uid" BIGSERIAL PRIMARY KEY,
    "role_name" VARCHAR(50) NOT NULL UNIQUE,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS "users"(
    "uid" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" BIGINT NULL UNIQUE,
    "role_uid" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "users_role_uid_foreign" FOREIGN KEY("role_uid") REFERENCES "role"("uid")
);

-- Create link table with auto-increment
CREATE TABLE IF NOT EXISTS "link"(
    "uid" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NULL,
    "original_link" VARCHAR(255) NOT NULL,
    "short_link" VARCHAR(255) NOT NULL UNIQUE,
    "users_uid" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "link_users_uid_foreign" FOREIGN KEY("users_uid") REFERENCES "users"("uid") ON DELETE CASCADE
);

-- Create link_click table with auto-increment
CREATE TABLE IF NOT EXISTS "link_click"(
    "uid" BIGSERIAL PRIMARY KEY,
    "link_uid" BIGINT NOT NULL,
    "ip_address" VARCHAR(45) NOT NULL,
    "agent" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "link_click_link_uid_foreign" FOREIGN KEY("link_uid") REFERENCES "link"("uid") ON DELETE CASCADE
);

-- Create twibone table with auto-increment
CREATE TABLE IF NOT EXISTS "twibone"(
    "uid" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NULL,
    "users_uid" UUID NOT NULL,
    "path" VARCHAR(255) NOT NULL UNIQUE,
    "url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "twibone_users_uid_foreign" FOREIGN KEY("users_uid") REFERENCES "users"("uid") ON DELETE CASCADE
);

-- Create twibone_used table with auto-increment
CREATE TABLE IF NOT EXISTS "twibone_used"(
    "uid" BIGSERIAL PRIMARY KEY,
    "twibone_uid" BIGINT NOT NULL,
    "ip_address" VARCHAR(45) NOT NULL,
    "agent" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "twibone_used_twibone_uid_foreign" FOREIGN KEY("twibone_uid") REFERENCES "twibone"("uid") ON DELETE CASCADE
);

-- Create creator_data table with auto-increment
CREATE TABLE IF NOT EXISTS "creator_data"(
    "uid" BIGSERIAL PRIMARY KEY,
    "users_uid" UUID NOT NULL UNIQUE,
    "bio" VARCHAR(255) NULL,
    "photo_profile_path" VARCHAR(255) NULL,
    "banner_photo_path" VARCHAR(255) NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT "creator_data_users_uid_foreign" FOREIGN KEY("users_uid") REFERENCES "users"("uid") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON "users"("email");
CREATE INDEX IF NOT EXISTS idx_users_role_uid ON "users"("role_uid");
CREATE INDEX IF NOT EXISTS idx_link_users_uid ON "link"("users_uid");
CREATE INDEX IF NOT EXISTS idx_link_short_link ON "link"("short_link");
CREATE INDEX IF NOT EXISTS idx_link_click_link_uid ON "link_click"("link_uid");
CREATE INDEX IF NOT EXISTS idx_twibone_users_uid ON "twibone"("users_uid");
CREATE INDEX IF NOT EXISTS idx_twibone_path ON "twibone"("path");
CREATE INDEX IF NOT EXISTS idx_twibone_used_twibone_uid ON "twibone_used"("twibone_uid");
CREATE INDEX IF NOT EXISTS idx_creator_data_users_uid ON "creator_data"("users_uid");
