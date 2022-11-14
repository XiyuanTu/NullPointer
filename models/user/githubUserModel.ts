import mongoose, { Schema, model, models } from "mongoose";

interface IUser {
  userId: Schema.Types.ObjectId;
  externalId: string;
}

const githubUserSchema = new Schema<IUser>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User_Account",
  },
  externalId: { type: String, required: true, unique: true },
});

const user = mongoose.connection.useDb("user");

const GithubUser =
  user.models["Github_User"] ||
  user.model<IUser>("Github_User", githubUserSchema);

export default GithubUser;
