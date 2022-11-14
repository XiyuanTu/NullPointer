import mongoose, { Schema, model, models } from "mongoose";

interface IUser {
  userId: Schema.Types.ObjectId;
  externalId: string;
}

const googleUserSchema = new Schema<IUser>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User_Account",
  },
  externalId: { type: String, required: true, unique: true },
});

const user = mongoose.connection.useDb("user");

const GoogleUser =
  user.models["Google_User"] ||
  user.model<IUser>("Google_User", googleUserSchema);

export default GoogleUser;
