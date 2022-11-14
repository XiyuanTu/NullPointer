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

  const { id } = req.query;

  if (req.method === "PATCH") {
    const { property, action, value } = req.body;

    try {
      await connectDB();
      let user;
      switch (property) {
        case UserInfo.Blocks:
          if (action === Action.Push) {
            const authorId = value.blocks;
            user = await UserAccount.findByIdAndUpdate(id, {
              $push: value,
              $pull: { following: authorId },
            });
          } else {
            user = await UserAccount.findByIdAndUpdate(id, { $pull: value });
          }
          break;
        case UserInfo.Description:
          user = await UserAccount.findByIdAndUpdate(id, value);
          break;
        case UserInfo.Avatar:
          user = await UserAccount.findByIdAndUpdate(id, value);
          break;
        default:
          // UserInfo.Following, UserInfo.Likes, UserInfo.Bookmarks
          if (action === Action.Push) {
            user = await UserAccount.findByIdAndUpdate(id, { $push: value });
          } else {
            user = await UserAccount.findByIdAndUpdate(id, { $pull: value });
          }
          break;
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
    try {
      await connectDB();

      const user = await UserAccount.findById(id, { __v: 0 }).lean();
      user._id = user._id + "";
      user.blocks = user.blocks.map(
        (blockId: mongoose.Types.ObjectId) => blockId + ""
      );

      if (!user) {
        return res.status(404).json({ message: "Not found!" });
      }

      return res.status(200).json({ message: "Success", user });
    } catch (error) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}
