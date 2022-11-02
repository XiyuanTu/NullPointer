declare interface User {
    _id: string;
    username: string;
    description?: string;
    avatar?: string;
    following: string[];
    likes: string[];
    bookmarks: string[];
}