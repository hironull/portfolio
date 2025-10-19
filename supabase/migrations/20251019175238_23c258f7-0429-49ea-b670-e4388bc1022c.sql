-- Add additional columns to visitor_logs for more detailed IP information
ALTER TABLE public.visitor_logs
ADD COLUMN IF NOT EXISTS isp text,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;