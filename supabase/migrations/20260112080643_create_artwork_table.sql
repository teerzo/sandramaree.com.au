-- Create artwork table
CREATE TABLE IF NOT EXISTS public.artwork (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  s3_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.artwork ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read access" ON public.artwork
  FOR SELECT
  USING (true);

-- Create a policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.artwork
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.artwork
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON public.artwork
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create an updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.artwork
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
