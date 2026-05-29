-- =============================================================================
-- RLS SECURITY FIX: channel_types & idea_groups (lookup / seed tables)
-- =============================================================================
--
-- SECURITY ISSUE (InsForge: security/rls-permissive)
--   The previous policies used `TO public USING (true)`, granting unrestricted
--   SELECT access to the `public` pseudo-role — which includes the `anon` role,
--   i.e. completely unauthenticated callers.
--
-- WHY THE ADVISOR'S SUGGESTED FIX IS INAPPLICABLE HERE
--   The advisor suggested `USING ((select auth.uid()) = user_id)`.
--   That pattern is correct for user-owned tables, but channel_types and
--   idea_groups are seed/lookup tables with NO user_id column.  Applying
--   that predicate would cause a column-not-found error and break the app.
--
-- CORRECT FIX FOR LOOKUP TABLES
--   Because there is no per-row owner, row-level filtering is impossible and
--   unnecessary.  The right control is *role-level*: restrict access to the
--   `authenticated` role (users who have presented a valid Clerk JWT) instead
--   of the `public` pseudo-role (which includes unauthenticated `anon` users).
--
--   Note: this project uses Clerk JWT, not Supabase Auth, so auth.uid() is
--   not applicable — requesting_user_id() is the identity function used
--   elsewhere in this schema.
-- =============================================================================

-- ── channel_types ─────────────────────────────────────────────────────────────
ALTER TABLE public.channel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_types FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channel_types_public_read" ON public.channel_types;

-- Only authenticated (Clerk JWT) users can read the platform lookup table.
-- Unauthenticated (anon) callers are blocked.
CREATE POLICY "channel_types_authenticated_read" ON public.channel_types
  FOR SELECT
  TO authenticated
  USING (true);

-- ── idea_groups ───────────────────────────────────────────────────────────────
ALTER TABLE public.idea_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_groups FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "idea_groups_public_read" ON public.idea_groups;

-- Only authenticated (Clerk JWT) users can read the status-group lookup table.
CREATE POLICY "idea_groups_authenticated_read" ON public.idea_groups
  FOR SELECT
  TO authenticated
  USING (true);


  