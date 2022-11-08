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

  const { id } = req.query;

  if (req.method === "GET") {

    try {
      await connectDB()
      const notes = await Note.find({userId: id}, {'__v': 0})
      return res.status(200).json({ notes });
    } catch (err) {
      return res.status(500).json({ message: "Fail to process"  });
    }
  }
}
