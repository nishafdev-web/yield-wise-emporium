-- Allow authenticated users to insert their own profile (needed when profile is missing after data wipe)
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);