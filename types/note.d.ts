declare interface Note {
  _id: string;
  name: string;
  userId: string;
  favorite: boolean;
  mdText: string;
  public: boolean;
  firstPublicAt: Date | string;
  title: string;
  createdAt: Date | string;
  lastModified: Date | string;
  tags: string[];
  like: number;
  bookmark: number;
  comment: number;
  comments: string[];
}

declare interface ForumNote {
  _id: string;
  name: string;
  mdText: string;
  public: boolean;
  firstPublicAt: Date;
  title: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  like: number;
  bookmark: number;
  comment: number;
  comments: string[];
  author: {
    _id: string;
    username: string;
    description?: string;
    avatar?: string;
  };
};

declare interface RenderTree {
  id: string;
  level: number;
  name: string;
  isNew: boolean;
  children?: RenderTree[];
  public?: boolean;
  firstPublicAt?: Date;
  favorite?: boolean;
}

declare interface Comment {
  _id: string;
  userId: string;
  content: string;
  createdAt: Date;
  likes: string[];
  deletedAt: Date;
  children: string[]
}

declare interface ConvertedComment extends Omit<Comment, 'children'>{
  to?: string;
  children: ConvertedComment[] | string[]
}