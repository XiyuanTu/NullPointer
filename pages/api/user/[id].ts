import { config } from "./../../../middleware";
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

  if (req.method === "PATCH") {
    const { id } = req.query;
    const {action, value} = req.body;

    try {
        await connectDB();
        let user
        if (action === Action.Push) {
          user = await UserAccount.findByIdAndUpdate(id, { $push: value });
        } else {
          user = await UserAccount.findByIdAndUpdate(id, { $pull: value });
        }
        
        if (!user) {
            return res.status(404).json({ message: "Not found!" });
        }

        return res.status(200).json({ message: "Success" });
        
      } catch (error) {
        return res.status(500).json({ message: "Fail to process" });
      }
  }

  if (req.method === "GET") {
    const { id } = req.query;

    try {
      await connectDB();
     
      const user = await UserAccount.findById(id, {__v: 0}).lean();
      user._id = user._id + ""
     
      if (!user) {
          return res.status(404).json({ message: "Not found!" });
      }

      return res.status(200).json({ message: "Success", user});
      
    } catch (error) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}