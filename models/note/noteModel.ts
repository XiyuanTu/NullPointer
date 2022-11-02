import mongoose, { Schema } from "mongoose";

interface INote {
  name: string;
  title: string;
  userId: Schema.Types.ObjectId;
  belongTo: Schema.Types.ObjectId;
  mdText: string;
  public: boolean;
  firstPublicAt: Date;
  favorite: boolean;
  createdAt: Date;
  lastModified: Date;
  tags: string[];
  like: number;
  bookmark: number;
  comment: number;
  comments: Schema.Types.ObjectId[],
}

const noteSchema = new Schema<INote>({
  name: { type: String, required: true},
  title: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User_Account'},
  belongTo: { type: Schema.Types.ObjectId},
  mdText: { type: String, default: ''},
  public: { type: Boolean, default: false },
  firstPublicAt: { type: Date, default: null},
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date()},
  lastModified: { type: Date, required: true },
  tags: { type: [String], default: []},
  like: { type: Number, default: 0},
  bookmark: { type: Number, default: 0},
  comment: { type: Number, default: 0},
  comments: { type: [Schema.Types.ObjectId], default: []},
});

const note = mongoose.connection.useDb('note');

const Note = note.models["Note"] || note.model<INote>("Note", noteSchema);

export default Note;
