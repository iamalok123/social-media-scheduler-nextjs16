-- Migration: fix_rls_lookup_tables
-- Fixes: InsForge security/rls-permissive on channel_types and idea_groups
-- Strategy: restrict TO public -> TO authenticated (role-level guard)
--           These are seed tables with no user_id column, so row-level
--           filtering is impossible; role-level access control is the
--           correct approach.

-- ── channel_types ─────────────────────────────────────────────────────────────
ALTER TABLE public.channel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_types FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channel_types_public_read"        ON public.channel_types;
DROP POLICY IF EXISTS "channel_types_authenticated_read" ON public.channel_types;

CREATE POLICY "channel_types_authenticated_read" ON public.channel_types
  FOR SELECT
  TO authenticated
  USING (true);

-- ── idea_groups ───────────────────────────────────────────────────────────────
ALTER TABLE public.idea_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_groups FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "idea_groups_public_read"        ON public.idea_groups;
DROP POLICY IF EXISTS "idea_groups_authenticated_read" ON public.idea_groups;

CREATE POLICY "idea_groups_authenticated_read" ON public.idea_groups
  FOR SELECT
  TO authenticated
  USING (true);
