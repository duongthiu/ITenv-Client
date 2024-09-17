export type PostType = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  image_url?: string;
  vote: number;
  comments?: CommentType[];
  user: {
    name: string;
  };
};
export type CommentType = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  vote: number;
  user: {
    name: string;
  };
};
