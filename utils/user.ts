export const convertUser = (user: User): User => {
    user._id = user._id + "";
    user.blocks = user.blocks.map(block => block + '')
    user.following = user.following.map(following => following + '')
    user.likes = user.likes.map(like => like + '')
    user.bookmarks = user.bookmarks.map(bookmark => bookmark + '')
    return user;
  }