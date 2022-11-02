
export enum NoteInfo {
    Name='name',
    MdText='mdText',
    Title='title',
    Favorite='favorite',
    Public='public',
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
    Following='following',
    Likes='likes',
    Bookmarks='bookmarks',
}

export enum Action {
    Push='push',
    Pull='pull'
}

export enum CommentInfo {
    Likes='likes',
    Deleted='deleted'
}