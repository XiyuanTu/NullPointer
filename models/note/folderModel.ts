import mongoose, { Schema, model, models } from "mongoose";

interface IFolder {
  name: string;
  userId: Schema.Types.ObjectId;
  belongTo: Schema.Types.ObjectId;
}

const folderSchema = new Schema<IFolder>({
  name: { type: String, required: true},
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User_Account'},
  belongTo: { type: Schema.Types.ObjectId},
});

const note = mongoose.connection.useDb('note');

const Folder = note.models["Folder"] || note.model<IFolder>("Folder", folderSchema);

export default Folder;