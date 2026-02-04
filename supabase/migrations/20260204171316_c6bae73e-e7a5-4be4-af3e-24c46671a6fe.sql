-- Fix admin_logs table: Remove overly permissive SELECT policy
-- The "Authenticated can view admin_logs" policy with qual=true allows any authenticated user to read admin logs
-- This conflicts with the intended "Only admins can read admin logs" policy

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated can view admin_logs" ON public.admin_logs;

-- The remaining "Only admins can read admin logs" policy with has_role_by_name check is correct
-- and will now be the only SELECT policy, properly restricting access to administrators only