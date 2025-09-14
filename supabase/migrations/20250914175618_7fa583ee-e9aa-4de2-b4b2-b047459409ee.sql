-- Enable Row Level Security on required tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders: SELECT policy (owner can view own orders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Orders are viewable by owner' AND polrelid = 'public.orders'::regclass
  ) THEN
    CREATE POLICY "Orders are viewable by owner"
    ON public.orders
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Orders: INSERT policy (owner can create own orders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Orders can be created by owner' AND polrelid = 'public.orders'::regclass
  ) THEN
    CREATE POLICY "Orders can be created by owner"
    ON public.orders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Orders: UPDATE policy (owner can update own orders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Orders can be updated by owner' AND polrelid = 'public.orders'::regclass
  ) THEN
    CREATE POLICY "Orders can be updated by owner"
    ON public.orders
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Orders: DELETE policy (owner can delete own orders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Orders can be deleted by owner' AND polrelid = 'public.orders'::regclass
  ) THEN
    CREATE POLICY "Orders can be deleted by owner"
    ON public.orders
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Order Items: SELECT policy (owner of the parent order can view)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Order items are viewable by owner' AND polrelid = 'public.order_items'::regclass
  ) THEN
    CREATE POLICY "Order items are viewable by owner"
    ON public.order_items
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1
        FROM public.orders o
        WHERE o.id = order_id AND o.user_id = auth.uid()
      )
    );
  END IF;
END
$$;

-- Order Items: INSERT policy (only for items tied to user's own orders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Order items can be created by owner' AND polrelid = 'public.order_items'::regclass
  ) THEN
    CREATE POLICY "Order items can be created by owner"
    ON public.order_items
    FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.orders o
        WHERE o.id = order_id AND o.user_id = auth.uid()
      )
    );
  END IF;
END
$$;

-- Order Items: UPDATE policy (only if item belongs to user's order)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Order items can be updated by owner' AND polrelid = 'public.order_items'::regclass
  ) THEN
    CREATE POLICY "Order items can be updated by owner"
    ON public.order_items
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1
        FROM public.orders o
        WHERE o.id = order_id AND o.user_id = auth.uid()
      )
    );
  END IF;
END
$$;

-- Order Items: DELETE policy (only if item belongs to user's order)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Order items can be deleted by owner' AND polrelid = 'public.order_items'::regclass
  ) THEN
    CREATE POLICY "Order items can be deleted by owner"
    ON public.order_items
    FOR DELETE
    USING (
      EXISTS (
        SELECT 1
        FROM public.orders o
        WHERE o.id = order_id AND o.user_id = auth.uid()
      )
    );
  END IF;
END
$$;