import mongoose, { Document, Schema, model, Types } from "mongoose";
import { type IFile } from "./file.dto";

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  folder: { type: String, required: false }, // Reference to Folder Schema
  mimeType: { type: String, required: true },
  //uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true } 
}, { timestamps: true });



export const File = model<IFile>("File", FileSchema);
