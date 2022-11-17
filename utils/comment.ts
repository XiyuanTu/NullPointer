import Comment from "../models/note/commentModel";
import UserAccount from "../models/user/userAccountModel";
import connectDB from "./connectDB";
import mongoose from "mongoose";

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