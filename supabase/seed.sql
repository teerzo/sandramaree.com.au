-- Create storage bucket for artworks
INSERT INTO storage.buckets (id, name, public)
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for artworks bucket
-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create new policies
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'artworks');

CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'artworks' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'artworks' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'artworks' 
    AND auth.role() = 'authenticated'
  );

-- Seed artwork table with sample data
INSERT INTO public.artwork (title, description, s3_url) VALUES
  (
    'BEACH BONFIRE',
    '',
    ''
  );
