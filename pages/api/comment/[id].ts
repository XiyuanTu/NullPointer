import { Action } from './../../../types/constants';
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../utils/connectDB";
import Note from "../../../models/note/noteModel";
import Folder from "../../../models/note/folderModel";
import mongoose from "mongoose";
import Comment from "../../../models/note/commentModel";
import { CommentInfo } from "../../../types/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Not authenticated!" });
  
  const {id} = req.query;
  
  if (req.method === "GET") {  
    try {
      await connectDB();
      const comment = await Comment.findById(id)
      return res.status(200).json({ message: "Success", comment});
    } catch (err) {
      return res.status(500).json({ message: "Fail to process"});
    }
  }

  if (req.method === "PATCH") {
    const { property, action, value } = req.body;

    try {
      await connectDB();
      let comment
      switch (property) {
        case CommentInfo.Likes:
          if (action === Action.Push) {
            comment = await Comment.findByIdAndUpdate(id, { $push: value });
          } else {
            comment = await Comment.findByIdAndUpdate(id, { $pull: value });
          }
          break;
        case CommentInfo.DeletedAt: 
          comment = await Comment.findByIdAndUpdate(id, {deletedAt: null});
          break;
        default:
          break;
      }

      if (!comment) {
        return res.status(404).json({ message: "Not found!" });
      }

      return res.status(200).json({ message: "Success" });
    } catch (e) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const date = new Date()
      const comment = await Comment.findByIdAndUpdate(id, {deletedAt: new Date()});
      if (!comment) {
        return res.status(404).json({ message: "Not found!" });
      }
      return res.status(200).json({ message: "Success", returnValue: date });
    } catch (e) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}