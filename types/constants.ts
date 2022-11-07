
export enum NoteInfo {
    Name='name',
    MdText='mdText',
    Title='title',
    Favorite='favorite',
    Public='public',
    FirstPublicAt='firstPublicAt',
    CreatedAt='createdAt',
    LastModified='lastModified',
    Tags='tags',
    Like='like',
    Bookmark='bookmark',
    Comment='comment',
}

export enum FileOrFolder {
    File='file',
    Folder='folder',
}

export enum Feedback {
    Success='success',
    Error='error',
    Warning='warning',
    Info='info'
}

export enum UserInfo {
    Description='description',
    Following='following',
    Followers='followers',
    Likes='likes',
    Bookmarks='bookmarks',
    Blocks='blocks',
}

export enum Action {
    Push='push',
    Pull='pull'
}

export enum CommentInfo {
    Likes='likes',
    DeletedAt='deletedAt'
}