-- Create meme_drafts table for storing user's meme drafts
CREATE TABLE IF NOT EXISTS meme_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Draft',
  template_id TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  text_captions JSONB NOT NULL DEFAULT '[]',
  text_color TEXT NOT NULL DEFAULT '#ffffff',
  font_size INTEGER NOT NULL DEFAULT 32,
  font_family TEXT NOT NULL DEFAULT 'Impact',
  text_shadow BOOLEAN NOT NULL DEFAULT true,
  filter_brightness INTEGER NOT NULL DEFAULT 100,
  filter_contrast INTEGER NOT NULL DEFAULT 100,
  filter_saturation INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for meme_drafts
ALTER TABLE meme_drafts ENABLE ROW LEVEL SECURITY;

-- Policy for selecting drafts (users can only see their own drafts)
CREATE POLICY select_own_drafts ON meme_drafts
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for inserting drafts (users can only insert their own drafts)
CREATE POLICY insert_own_drafts ON meme_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for updating drafts (users can only update their own drafts)
CREATE POLICY update_own_drafts ON meme_drafts
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for deleting drafts (users can only delete their own drafts)
CREATE POLICY delete_own_drafts ON meme_drafts
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_meme_drafts_updated_at
  BEFORE UPDATE ON meme_drafts
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column();
