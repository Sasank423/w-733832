
export interface Profile {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Meme {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  vote_count: number;
  view_count: number;
  comment_count: number;
  is_meme_of_day: boolean;
  is_weekly_champion: boolean;
}

export interface Tag {
  id: string;
  name: string;
}

export interface MemeTag {
  meme_id: string;
  tag_id: string;
}

export interface Vote {
  id: string;
  meme_id: string;
  user_id: string;
  value: number;
  created_at: string;
}

export interface Comment {
  id: string;
  meme_id: string;
  user_id: string;
  text: string;
  created_at: string;
  updated_at: string;
}
