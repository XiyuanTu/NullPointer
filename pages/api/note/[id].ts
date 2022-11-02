import { config } from "./../../../middleware";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../utils/connectDB";
import Note from "../../../models/note/noteModel";

import mongoose from "mongoose";
import { FileOrFolder, NoteInfo } from "../../../types/constants";
import Folder from "../../../models/note/folderModel";
import Comment from "../../../models/note/commentModel";
import { getCommentIds } from "../../../utils/notes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Not authenticated!" });

  // get a note
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      await connectDB();
      const note = await Note.findById(id);
      if (!note) {
        return res.status(404).json({ message: "Not found!" });
      }
      return res.status(200).json({ note });
    } catch (err) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }

  if (req.method === "PATCH") {
    const { id } = req.query;
    const { property, value } = req.body;
    let returnValue

    try {
      await connectDB();
      let note;

      switch (property) {
        case NoteInfo.Name:
          if (value.children) {
            note = await Folder.findByIdAndUpdate(id, {
              name: value.name,
            });
          } else {
            note = await Note.findByIdAndUpdate(id, {
              name: value.name,
            });
          }
          break

        case NoteInfo.Like:
          note = await Note.findByIdAndUpdate(id, {
            $inc: { like: value },
          }).lean();
          break

        case NoteInfo.Bookmark:
          note = await Note.findByIdAndUpdate(id, {
            $inc: { bookmark: value },
          }).lean();
          break

        //other properties
        default:
          note = await Note.findByIdAndUpdate(id, value);
      }
      if (!note) {
        return res.status(404).json({ message: "Not found!" });
      }

      if (returnValue) {
        return res.status(200).json({ message: "Success", returnValue });
      }
      return res.status(200).json({ message: "Success" });
    } catch (error) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }

  // delete file/folder
  if (req.method === "DELETE") {
    const { id } = req.query;
    const { type } = req.body;

    try {
      await connectDB();

      const note = await Note.findById(id)
      const commentIds = note.comments.map((comment: mongoose.Types.ObjectId) => comment + '')
      const commentIdsToDelete = await getCommentIds(commentIds)

      await Comment.deleteMany({_id: {$in: commentIdsToDelete}})

      if (type === FileOrFolder.File) {
        await Note.deleteOne({ _id: id });
      } else {
        const folder = await Folder.findById(id);
        const folderIds: string[] = [];
        const fileIds: string[] = [];

        const getIds = async (
          folder: any,
          folderIds: string[],
          fileIds: string[]
        ) => {
          if (!folder) {
            return;
          }

          folderIds.push(folder._id + "");

          const files = await Note.find({ belongTo: folder._id });
          files.map((file) => fileIds.push(file._id + ""));

          const folders = await Folder.find({ belongTo: folder._id });

          //Some result may not be in the array if Array.map is used due to asynchronous
          for (let folder of folders) {
            await getIds(folder, folderIds, fileIds);
          }
        };

        await getIds(folder, folderIds, fileIds);
        await Folder.deleteMany({ _id: { $in: folderIds } });
        await Note.deleteMany({ _id: { $in: fileIds } });
      }
      return res.status(200).json({ message: "Success" });
    } catch (error) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}
