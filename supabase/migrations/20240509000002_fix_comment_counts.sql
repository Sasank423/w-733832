-- Create a trigger function to handle comment counts
CREATE OR REPLACE FUNCTION process_comment_change()
RETURNS TRIGGER AS $$
DECLARE
    v_meme_id UUID;
    v_comment_count INTEGER;
BEGIN
    -- Determine which meme_id we're dealing with
    IF TG_OP = 'DELETE' THEN
        v_meme_id := OLD.meme_id;
    ELSE
        v_meme_id := NEW.meme_id;
    END IF;
    
    -- Count all comments for this meme
    SELECT COUNT(*) INTO v_comment_count
    FROM comments
    WHERE meme_id = v_meme_id;
    
    -- Update the meme comment count
    -- This runs with SECURITY DEFINER so it bypasses RLS
    UPDATE memes
    SET comment_count = v_comment_count
    WHERE id = v_meme_id;
    
    RETURN NULL; -- For AFTER triggers, return value is ignored
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS after_comment_change ON comments;

-- Create trigger to call our function whenever comments change
CREATE TRIGGER after_comment_change
AFTER INSERT OR UPDATE OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION process_comment_change();
