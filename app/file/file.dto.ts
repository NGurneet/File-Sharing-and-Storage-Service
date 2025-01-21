import mongoose, { Mongoose } from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";
/**
 * Represents a File object in the system, extending the BaseSchema.
 *
 * @interface IFile
 * @extends {BaseSchema}
 */
export interface IFile extends BaseSchema {
    /**
     * The name of the file.
     */
    name: string;
    /**
     * The URL where the file can be accessed.
     */
    url: string;
    /**
     * The size of the file in bytes.
     */
    size: number;
    /**
     * The folder where the file is stored.
     */
    folder: string; // Reference to Folder Schema
    /**
     * The MIME type of the file.
     */
    mimeType: string;
    // /**
    //  * The user who uploaded the file.
    //  */
    // uploadedBy: mongoose.ObjectId;
    uploadedBy: mongoose.Types.ObjectId;
}
