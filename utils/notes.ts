import Comment from "../models/note/commentModel";
import UserAccount from "../models/user/userAccountModel";
import connectDB from "./connectDB";
import mongoose from "mongoose";


export const convertForumData = async (rawNotes: any[]) => {
  await connectDB();
  const newNotes: ForumNote[] = [];

  for (let rawNote of rawNotes) {
    const author = await UserAccount.findById(rawNote.userId, {
      password: 0,
    }).lean();
    author._id = author._id + "";
    author.blocks = author.blocks.map((blockId: mongoose.Types.ObjectId) => blockId + '')
    let comments = []
    for (let id of rawNote.comments) {
      comments.push(id + "")
    }
    delete rawNote.userId;
    newNotes.push({
      ...rawNote,
      _id: rawNote._id + "",
      author,
      createdAt: new Date(rawNote!.createdAt).toLocaleString(),
      lastModified: new Date(rawNote!.lastModified).toLocaleString(),
      firstPublicAt: new Date(rawNote!.firstPublicAt).toLocaleString(),
      comments
    });
  }

  return newNotes;
};

export const convertUser = (user: User): User => {
  user._id = user._id + "";
  user.blocks = user.blocks.map(block => block + '')
  user.following = user.following.map(following => following + '')
  user.likes = user.likes.map(like => like + '')
  user.bookmarks = user.bookmarks.map(bookmark => bookmark + '')
  return user;
}

export const convertNote = (note: Note) => {
  note._id = note._id + "";
  note.userId = note.userId + ''
  note.createdAt = note.createdAt.toLocaleString()
  note.lastModified = note.lastModified.toLocaleString()
  if (note.firstPublicAt) {
    note.firstPublicAt = note.firstPublicAt.toLocaleString()
  }
  note.comments = note.comments.map(comment => comment + '')
  return note;
}

export const getComments = async(commentIds: string[]) => {
  await connectDB();

  const fetchComment = async(comment: any, children: any, childrenIds: any, commentId: string) => {
    if (childrenIds.length === 0) {
      return 
    }

    const newComments = await Comment.find({_id: {$in: childrenIds}}, {__v: 0}).lean()

    for (let newComment of newComments) {
      newComment._id = newComment._id + ""
      newComment.userId = newComment.userId + ""

      // when the comment doesn't reply to the first level comment, it doesn't need 'to' field
      if (comment._id !== commentId) {
        newComment.to = comment._id
      }
      children.push(newComment)
      await fetchComment(newComment, children, newComment.children, commentId)
    }
  }
  
  const comments = await Comment.find({_id: {$in: commentIds}}, {__v: 0}).lean()
  for (let comment of comments) {
    comment._id = comment._id + ""
    comment.userId = comment.userId + ""
    const childrenIds = comment.children
    comment.children = []
    const children = comment.children
    await fetchComment(comment, children, childrenIds, comment._id)
    comment.children.sort((a: any, b: any) => a.createdAt - b.createdAt)
  }

  return comments.sort((a, b) => b.like === a.like ? a.createdAt - b.createdAt : b.like - a.like)
}


export const getCommentIds = async(commentIds: string[]) => {
  await connectDB();
  const result = []

  while (commentIds.length > 0) {
    const commentId = commentIds.shift()
    result.push(commentId)
    const comment = await Comment.findById(commentId)
    commentIds.push(...comment.children)
  }

  return result
}

