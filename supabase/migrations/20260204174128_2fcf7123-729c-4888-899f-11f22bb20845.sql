-- Fix overly permissive RLS policies

-- 1. Fix service_usage_log - change from PUBLIC to service_role only
-- PUBLIC with true is dangerous, allowing anyone to insert
DROP POLICY IF EXISTS "Service kann Usage einfügen" ON public.service_usage_log;

CREATE POLICY "Service role can insert usage logs"
ON public.service_usage_log
FOR INSERT
TO service_role
WITH CHECK (true);

-- 2. Clean up duplicate leads policies - keep only one
DROP POLICY IF EXISTS "Authenticated users can submit leads" ON public.leads;

-- The remaining "Authenticated can submit leads" policy is acceptable
-- as it allows any authenticated user to submit leads (common for lead forms)