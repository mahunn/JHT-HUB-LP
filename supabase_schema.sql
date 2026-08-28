-- ==============================================================================
-- JHT HUB E-Commerce Database Schema for Supabase (Persistent Orders & Data)
-- ==============================================================================
-- Run this script in your Supabase Project's SQL Editor (https://supabase.com/dashboard)
-- It creates a high-performance JSON document table that permanently stores:
-- 1. Orders (never deleted on server restarts)
-- 2. Leads (abandoned checkout recovery)
-- 3. Product & packages details
-- 4. Store settings & tracking pixels
-- ==============================================================================

-- 1. Create kv_store table
CREATE TABLE IF NOT EXISTS public.kv_store (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.kv_store ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy to allow read/write operations from your Next.js API
DROP POLICY IF EXISTS "Allow full access to kv_store" ON public.kv_store;
CREATE POLICY "Allow full access to kv_store"
ON public.kv_store
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Enable Realtime (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.kv_store;
