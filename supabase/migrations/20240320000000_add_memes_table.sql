-- Create memes table
CREATE TABLE IF NOT EXISTS memes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    template_url TEXT NOT NULL,
    top_text TEXT,
    bottom_text TEXT,
    view_count INTEGER DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_meme_of_day BOOLEAN DEFAULT false,
    is_weekly_champion BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view memes
CREATE POLICY "Anyone can view memes"
    ON memes FOR SELECT
    USING (true);

-- Allow authenticated users to create memes
CREATE POLICY "Authenticated users can create memes"
    ON memes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = creator_id);

-- Allow users to update their own memes
CREATE POLICY "Users can update their own memes"
    ON memes FOR UPDATE
    TO authenticated
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Allow users to delete their own memes
CREATE POLICY "Users can delete their own memes"
    ON memes FOR DELETE
    TO authenticated
    USING (auth.uid() = creator_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_memes_updated_at
    BEFORE UPDATE ON memes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 