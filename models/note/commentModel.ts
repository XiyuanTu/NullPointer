import mongoose, { Schema } from "mongoose";

interface IComment {
  userId: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  likes: Schema.Types.ObjectId[];
  deleted: boolean;
  deletedAt: Date;
  children: Schema.Types.ObjectId[]
}

const commentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User_Account'},
  content: { type: String, required: true},
  createdAt: { type: Date, default: new Date()},
  likes: { type: [Schema.Types.ObjectId], default: []},
  deleted: {type: Boolean, default: false},
  deletedAt: { type: Date, default: null},
  children: { type: [Schema.Types.ObjectId], default: []},
});

const note = mongoose.connection.useDb('note');

const Comment = note.models["Comment"] || note.model<IComment>("Comment", commentSchema);

export default Comment;