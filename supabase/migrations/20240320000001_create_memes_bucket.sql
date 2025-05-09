-- Create a new storage bucket for memes
INSERT INTO storage.buckets (id, name, public)
VALUES ('memes', 'memes', true);

-- Allow public access to view memes
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'memes');

-- Allow authenticated users to upload memes
CREATE POLICY "Authenticated users can upload memes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'memes');

-- Allow users to update their own memes
CREATE POLICY "Users can update their own memes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'memes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own memes
CREATE POLICY "Users can delete their own memes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'memes' AND auth.uid()::text = (storage.foldername(name))[1]); 