import { FileOrFolder } from './../../../types/constants';
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../utils/connectDB";
import Note from "../../../models/note/noteModel";
import Folder from "../../../models/note/folderModel";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Not authenticated!" });

  const { id } = session.user;

  if (req.method === "POST") {
    
    const { name, belongTo, createdAt, lastModified, type } = req.body;

    try {
      let nodeId;
      await connectDB()
      if (type === FileOrFolder.File) {
        const note = {name, userId: id, createdAt, lastModified}
        let newNote;
        if (belongTo) {
          newNote = new Note({ ...note, belongTo});
        } else {
          newNote = new Note(note);
        }
        await newNote.save();
        nodeId = newNote._id + ''
      } else {
        let newFolder;
        if (belongTo) {
          newFolder = new Folder({
            name,
            userId: id,
            belongTo: new mongoose.Types.ObjectId(belongTo),
          });
        } else {
          newFolder = new Folder({
            name,
            userId: id,
          });
        }
        await newFolder.save();
        nodeId = newFolder._id + ''
      }
      return res.status(200).json({ nodeId });
    } catch (err) {
      return res.status(500).json({ message: "Fail to process"  });
    }
  }
}
