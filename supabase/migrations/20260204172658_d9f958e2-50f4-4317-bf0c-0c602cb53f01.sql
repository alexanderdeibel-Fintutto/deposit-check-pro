-- Fix user_profiles security
-- Remove the risky INSERT policy that allows public role
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Remove duplicate INSERT policies - keep only one authenticated policy
DROP POLICY IF EXISTS "users_insert_own_profile" ON public.user_profiles;

-- The remaining policies properly restrict access:
-- - "Users can insert own profile" (authenticated, id = auth.uid())
-- - "Users can view own profile" (authenticated, id = auth.uid())
-- - "Users can update own profile" (authenticated, id = auth.uid())
-- - "users_view_own_profile" (authenticated, id = auth.uid())
-- - "users_update_own_profile" (authenticated, id = auth.uid())

-- Remove duplicate SELECT/UPDATE policies to clean up
DROP POLICY IF EXISTS "users_view_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.user_profiles;

-- Fix tenants table security
-- Add policy to allow tenants to view their own data (via user_id link)
-- This allows a user who is linked as a tenant to see their own tenant record
CREATE POLICY "Tenants can view own data"
ON public.tenants
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Add policy to allow tenants to update their own contact information
CREATE POLICY "Tenants can update own data"
ON public.tenants
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());