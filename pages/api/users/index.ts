import { config } from "../../../middleware";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../utils/connectDB";
import Note from "../../../models/note/noteModel";

import mongoose from "mongoose";
import { Action, UserInfo } from "../../../types/constants";
import Folder from "../../../models/note/folderModel";
import UserAccount from "../../../models/user/userAccountModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Not authenticated!" });

  if (req.method === "GET") {
    try {
      await connectDB();
      const value = req.query['value[]']  
      const users = await UserAccount.find({'_id': {$in: value}}, { _id: 1, username: 1, description: 1, avatar: 1, followers: 1 }).lean();

      return res.status(200).json({ message: "Success", users });
    } catch (error) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}
