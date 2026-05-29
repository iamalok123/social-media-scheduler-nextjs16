-- =============================================================================
-- Migration: fix-rls-lookup-tables
-- Description: Tighten RLS on seed/lookup tables — restrict TO public -> TO
--              authenticated so anonymous callers cannot read platform data.
--              Fixes InsForge advisory: security/rls-permissive
-- Already applied: YES (via db import) — tracked here as baseline
-- =============================================================================

-- ── channel_types ─────────────────────────────────────────────────────────────
ALTER TABLE public.channel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_types FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channel_types_public_read"        ON public.channel_types;
DROP POLICY IF EXISTS "channel_types_authenticated_read" ON public.channel_types;

-- Only authenticated (Clerk JWT) users can read the platform lookup table.
CREATE POLICY "channel_types_authenticated_read" ON public.channel_types
  FOR SELECT
  TO authenticated
  USING (true);

-- ── idea_groups ───────────────────────────────────────────────────────────────
ALTER TABLE public.idea_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_groups FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "idea_groups_public_read"        ON public.idea_groups;
DROP POLICY IF EXISTS "idea_groups_authenticated_read" ON public.idea_groups;

-- Only authenticated (Clerk JWT) users can read the status-group lookup table.
CREATE POLICY "idea_groups_authenticated_read" ON public.idea_groups
  FOR SELECT
  TO authenticated
  USING (true);
