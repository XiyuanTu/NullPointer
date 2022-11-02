import mongoose, { Schema, model, models } from "mongoose";


interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string,
  description: string,
  following: string[],
  likes: string[],
  bookmarks: string[],
}

const userAccountSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  avatar: { type: String},
  description: { type: String, default: "",},
  following: { type: [String], default: [],},
  likes: { type: [String], default: [],},
  bookmarks: { type: [String], default: [],},
});

const user = mongoose.connection.useDb('user');

const UserAccount = user.models['User_Account'] || user.model<IUser>('User_Account', userAccountSchema);

export default UserAccount