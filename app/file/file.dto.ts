import mongoose, { Mongoose } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IFile extends BaseSchema {
    name: string;
    url: string;
    size: number;
    folder: string; // Reference to Folder Schema
    mimeType: string;
    //uploadedBy: mongoose.ObjectId;
  }