-- First, check if votes table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'votes') THEN
        -- Create votes table if it doesn't exist
        CREATE TABLE votes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            meme_id UUID REFERENCES memes(id) ON DELETE CASCADE,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            value INTEGER NOT NULL CHECK (value = 1 OR value = -1),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            UNIQUE(meme_id, user_id)
        );
    END IF;
END $$;

-- Enable RLS on votes table
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Clear any existing policies on votes table
DROP POLICY IF EXISTS "Users can only vote on their own memes" ON votes;
DROP POLICY IF EXISTS "Users can only update their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
DROP POLICY IF EXISTS "Any authenticated user can create votes" ON votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON votes; 

-- Create fresh policies

-- Anyone can view all votes
CREATE POLICY "Anyone can view votes"
    ON votes FOR SELECT
    USING (true);

-- Any authenticated user can vote on any meme
CREATE POLICY "Any authenticated user can create votes"
    ON votes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own votes
CREATE POLICY "Users can update their own votes"
    ON votes FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can only delete their own votes
CREATE POLICY "Users can delete their own votes"
    ON votes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Now fix the memes table policies
-- First remove any conflicting policies
DROP POLICY IF EXISTS "Any authenticated user can update vote counts" ON memes;
DROP POLICY IF EXISTS "Users can update their own memes" ON memes;

-- Create a new policy that allows users to update their own memes (all fields)
CREATE POLICY "Users can update their own memes"
    ON memes FOR UPDATE
    TO authenticated
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);
    
-- Create a service function that allows updating vote and dislike counts
CREATE OR REPLACE FUNCTION update_meme_vote_counts(
    meme_uuid UUID,
    new_vote_count INTEGER,
    new_dislike_count INTEGER
) RETURNS VOID AS $$
BEGIN
    UPDATE memes
    SET 
        vote_count = new_vote_count,
        dislike_count = new_dislike_count
    WHERE id = meme_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_meme_vote_counts TO authenticated;
