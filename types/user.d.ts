declare interface User {
    _id: string;
    username: string;
    description?: string;
    avatar?: string;
    following: string[];
    followers: string[];
    likes: string[];
    bookmarks: string[];
    blocks: string[];
}