-- Migration: add_fk_index_user_channels_channel_type_id
-- Fixes: InsForge performance/missing-fk-index on user_channels.channel_type_id
--
-- WHY THIS MATTERS:
--   channel_type_id is a foreign key referencing channel_types(id).
--   Without an index:
--     - JOINs between user_channels and channel_types require full table scans
--     - ON DELETE RESTRICT on channel_types will scan the entire user_channels
--       table to check for referencing rows — acquiring a table-level lock that
--       blocks all concurrent writes
--
-- Note: CONCURRENTLY is omitted here because InsForge db import runs inside a
--   transaction block, and CONCURRENTLY is forbidden inside transactions.
--   user_channels is a small per-user table (typically <100 rows per user) so
--   a plain index build is instant and safe with no meaningful lock contention.

CREATE INDEX IF NOT EXISTS idx_user_channels_channel_type_id
  ON public.user_channels (channel_type_id);
