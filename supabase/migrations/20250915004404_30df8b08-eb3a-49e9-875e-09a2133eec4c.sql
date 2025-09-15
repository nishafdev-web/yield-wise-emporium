-- Enable RLS and add user-scoped policies for orders and order_items
-- Orders table policies
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own orders"
  ON public.orders
  FOR UPDATE
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete their own orders"
  ON public.orders
  FOR DELETE
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Order items table policies
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can insert items for their orders"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view items for their orders"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update items for their orders"
  ON public.order_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete items for their orders"
  ON public.order_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;