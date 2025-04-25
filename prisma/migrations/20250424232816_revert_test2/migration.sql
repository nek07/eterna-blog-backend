-- This is an empty migration./* ---------- 1. Удаляем внешние ключи ---------- */
ALTER TABLE "RefreshToken" DROP CONSTRAINT IF EXISTS "RefreshToken_userId_fkey";
ALTER TABLE "Post"         DROP CONSTRAINT IF EXISTS "Post_authorId_fkey";

/* ---------- 2. Удаляем уникальные индексы ---------- */
DROP INDEX IF EXISTS "RefreshToken_token_key";
DROP INDEX IF EXISTS "User_email_key";
DROP INDEX IF EXISTS "Post_slug_key";

/* ---------- 3. Удаляем таблицы ---------- */
DROP TABLE IF EXISTS "RefreshToken";
DROP TABLE IF EXISTS "Post";
DROP TABLE IF EXISTS "User";

/* ---------- 4. Удаляем enum-тип ---------- */
DROP TYPE IF EXISTS "Role";
