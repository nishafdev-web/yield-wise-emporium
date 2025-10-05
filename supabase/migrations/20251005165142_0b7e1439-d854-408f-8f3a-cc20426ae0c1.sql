-- First, make the existing category column nullable to avoid conflicts
ALTER TABLE public.products ALTER COLUMN category DROP NOT NULL;

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_logs table
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS ingredients TEXT,
ADD COLUMN IF NOT EXISTS application_info TEXT,
ADD COLUMN IF NOT EXISTS safety_info TEXT;

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- Inventory logs policies
CREATE POLICY "Admins can view inventory logs" ON public.inventory_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role));
CREATE POLICY "Admins can create inventory logs" ON public.inventory_logs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::user_role));

-- Analytics events policies
CREATE POLICY "Anyone authenticated can create events" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can view all events" ON public.analytics_events FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role));

-- Seed categories
INSERT INTO public.categories (name, slug) VALUES
  ('Insecticides', 'insecticides'),
  ('Herbicides', 'herbicides'),
  ('Fungicides', 'fungicides'),
  ('Rodenticides', 'rodenticides'),
  ('Plant Growth Regulators', 'plant-growth-regulators'),
  ('Soil Fumigants', 'soil-fumigants'),
  ('Biopesticides', 'biopesticides'),
  ('Adjuvants', 'adjuvants'),
  ('Seed Treatment', 'seed-treatment'),
  ('Nematicides', 'nematicides')
ON CONFLICT (slug) DO NOTHING;