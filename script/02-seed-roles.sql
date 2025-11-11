-- Step 2: Seed default roles
INSERT INTO "role" (uid, role_name, created_at, updated_at) VALUES
(1, 'user', NOW(), NOW()),
(2, 'creator', NOW(), NOW()),
(3, 'admin', NOW(), NOW())
ON CONFLICT (uid) DO NOTHING;
