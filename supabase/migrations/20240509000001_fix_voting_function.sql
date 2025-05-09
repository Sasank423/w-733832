-- DROP existing function to avoid conflicts
DROP FUNCTION IF EXISTS handle_meme_vote(UUID, UUID, INTEGER);
DROP FUNCTION IF EXISTS process_vote_change();
DROP TRIGGER IF EXISTS after_vote_change ON votes;

-- Create a completely different approach using triggers
-- First, fix RLS policies on both tables

-- 1. Fix the memes table RLS
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;

-- Add a policy that allows any authenticated user to view any meme
DROP POLICY IF EXISTS "Anyone can view memes" ON memes;
CREATE POLICY "Anyone can view memes"
    ON memes FOR SELECT
    USING (true);

-- Add a policy that allows users to update their own memes
DROP POLICY IF EXISTS "Users can update their own memes" ON memes;
CREATE POLICY "Users can update their own memes"
    ON memes FOR UPDATE
    TO authenticated
    USING (auth.uid() = creator_id);

-- 2. Fix the votes table RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Add a policy that allows any authenticated user to view votes
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
CREATE POLICY "Anyone can view votes"
    ON votes FOR SELECT
    USING (true);

-- Add a policy that allows any authenticated user to create votes
DROP POLICY IF EXISTS "Any authenticated user can create votes" ON votes;
CREATE POLICY "Any authenticated user can create votes"
    ON votes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Add a policy that allows any authenticated user to update their own votes
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
CREATE POLICY "Users can update their own votes"
    ON votes FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Add a policy that allows any authenticated user to delete their own votes
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;
CREATE POLICY "Users can delete their own votes"
    ON votes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 3. Create a trigger function to update meme vote counts whenever votes change
CREATE OR REPLACE FUNCTION process_vote_change()
RETURNS TRIGGER AS $$
DECLARE
    v_meme_id UUID;
    v_like_count INTEGER;
    v_dislike_count INTEGER;
    v_creator_id UUID;
BEGIN
    -- Determine which meme_id we're dealing with
    IF TG_OP = 'DELETE' THEN
        v_meme_id := OLD.meme_id;
    ELSE
        v_meme_id := NEW.meme_id;
    END IF;
    
    -- Get the creator_id of the meme (we'll need this to bypass RLS)
    SELECT creator_id INTO v_creator_id
    FROM memes
    WHERE id = v_meme_id;
    
    -- Count all the likes and dislikes for this meme
    SELECT 
        COUNT(CASE WHEN value = 1 THEN 1 END) as likes,
        COUNT(CASE WHEN value = -1 THEN 1 END) as dislikes
    INTO 
        v_like_count, 
        v_dislike_count
    FROM votes
    WHERE meme_id = v_meme_id;
    
    -- Now update the meme counts
    -- This runs with SECURITY DEFINER so it bypasses RLS
    UPDATE memes
    SET 
        vote_count = v_like_count,
        dislike_count = v_dislike_count
    WHERE id = v_meme_id;
    
    RETURN NULL; -- For AFTER triggers, return value is ignored
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to call our function whenever votes change
CREATE TRIGGER after_vote_change
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION process_vote_change();

-- 4. Create a helper function to make it easier to vote from the frontend
CREATE OR REPLACE FUNCTION vote_on_meme(
    p_meme_id UUID,
    p_vote_value INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_existing_vote RECORD;
BEGIN
    -- Check authentication
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'You must be logged in to vote';
    END IF;
    
    -- Check vote value
    IF p_vote_value != 1 AND p_vote_value != -1 THEN
        RAISE EXCEPTION 'Invalid vote value: must be 1 or -1';
    END IF;
    
    -- Check if the user already voted
    SELECT * INTO v_existing_vote
    FROM votes
    WHERE meme_id = p_meme_id AND user_id = v_user_id;
    
    IF v_existing_vote.id IS NOT NULL THEN
        -- User already voted
        IF v_existing_vote.value = p_vote_value THEN
            -- Same vote - remove it
            DELETE FROM votes WHERE id = v_existing_vote.id;
        ELSE
            -- Different vote - update it
            UPDATE votes 
            SET value = p_vote_value
            WHERE id = v_existing_vote.id;
        END IF;
    ELSE
        -- New vote
        INSERT INTO votes (meme_id, user_id, value)
        VALUES (p_meme_id, v_user_id, p_vote_value);
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION vote_on_meme TO authenticated;
