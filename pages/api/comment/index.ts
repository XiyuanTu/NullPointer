import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../utils/connectDB";
import Note from "../../../models/note/noteModel";
import Folder from "../../../models/note/folderModel";
import mongoose from "mongoose";
import { getComments } from "../../../utils/notes";
import Comment from "../../../models/note/commentModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Not authenticated!" });

  if (req.method === "GET") {
    const commentIds = req.query["commentIds[]"];

    try {
      await connectDB();
      const comments = await getComments(commentIds as string[]);
      return res
        .status(200)
        .json({ message: "Success", convertedComments: comments });
    } catch (err) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }

  if (req.method === "POST") {
    const { to, userId, content, noteId } = req.body;
    try {
      await connectDB();
      const comment = new Comment({ userId, content });
      await comment.save();

      if (to) {
        await Comment.findByIdAndUpdate(to, {
          $push: { children: comment._id },
        });
      } else {
        await Note.findByIdAndUpdate(noteId, {
          $push: { comments: comment._id },
        });
      }
      await Note.findByIdAndUpdate(noteId, { $inc: { comment: 1 } });

      return res.status(200).json({ message: "Success", returnValue: comment });
    } catch (e) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}
