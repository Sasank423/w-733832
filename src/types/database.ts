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
  creator?: Profile;
  tags?: MemeTag[];
  dislike_count: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface MemeTag {
  meme_id?: string;
  tag_id: string;
  tags?: Tag;
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

export interface UserWithProfile {
  id: string;
  email?: string;
  username: string;
  avatar?: string;
  bio?: string;
}

// Interface to define the mock meme format used in UserDashboard
export interface MockMemeFormat {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  voteCount: number;
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  isFeatured?: boolean;
  isMemeOfTheDay?: boolean;
  isWeeklyChampion?: boolean;
  stats?: {
    views?: number;
    comments?: number;
  };
  description?: string;
}

// Interface for draggable text caption in meme drafts
export interface DraggableCaption {
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize?: number;
  color?: string;
  fontFamily?: string;
}

// Interface for meme drafts stored in the database
export interface MemeDraftDB {
  id: string;
  user_id: string;
  title: string;
  template_id?: string;
  image_urls: string[];
  text_captions: DraggableCaption[];
  text_color: string;
  font_size: number;
  font_family: string;
  text_shadow: boolean;
  filter_brightness: number;
  filter_contrast: number;
  filter_saturation: number;
  created_at: string;
  updated_at: string;
}
