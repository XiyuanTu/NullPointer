import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../utils/connectDB";
import mongoose from "mongoose";
import { Action, UserInfo } from "../../../types/constants";
import UserAccount from "../../../models/user/userAccountModel";
import { convertUser } from "../../../utils/user";

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

      const user = await UserAccount.findById(id, { email: 0, password: 0, __v: 0 }).lean();
      const convertedUser = convertUser(user)

      if (!user) {
        return res.status(404).json({ message: "Not found!" });
      }

      return res.status(200).json({ message: "Success", user: convertedUser});
    } catch (error) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}
