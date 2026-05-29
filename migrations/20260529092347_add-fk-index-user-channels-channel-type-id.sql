-- =============================================================================
-- Migration: add-fk-index-user-channels-channel-type-id
-- Description: Add missing index on the channel_type_id FK column of
--              user_channels. Fixes InsForge advisory: performance/missing-fk-index
--              Without this index, JOINs and ON DELETE RESTRICT checks require
--              full table scans, blocking concurrent writes.
-- Already applied: YES (via db import) — tracked here as baseline
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_user_channels_channel_type_id
  ON public.user_channels (channel_type_id);

