import { request } from "express";
import { extractUserId } from "../common/middleware/role-auth.middleware";
import { File } from "./file.schema";
import { uploadToCloudinary, deleteFromCloudinary } from "./file.util";
import mongoose from "mongoose";

/**
 * Upload a file to Cloudinary and store its details in the database.
 * 
 * @param {Express.Multer.File} file - The file being uploaded.
 * @param {string} folder - The folder in which the file will be stored on Cloudinary.
 * @returns {Promise<any>} The newly created file document containing details such as name, url, size, etc.
 */
// export const uploadFile = async (file: Express.Multer.File, folder: string) => {
//     console.log("User Id");
//     console.log(request.user?._id,);

//     // Upload file to Cloudinary
//     const result = await uploadToCloudinary(file.path, folder);

//     // Create a new file record in the database
//     const newFile = await File.create({
//         name: file.originalname,
//         url: result.secure_url,
//         size: file.size,
//         folder,
//         mimeType: file.mimetype,
//     });

//     return newFile;
// };

export const uploadFile = async (file: Express.Multer.File, folder: string, userId: string) => {
  console.log("User Id:", userId);

  // Upload file to Cloudinary
  const result = await uploadToCloudinary(file.path, folder);

  // Create a new file record in the database, linking it to the user
  const newFile = await File.create({
    name: file.originalname,
    url: result.secure_url,  // The URL from Cloudinary after upload
    size: file.size,
    folder,
    mimeType: file.mimetype,
    uploadedBy: userId, // Link file to the user who uploaded it
  });

  return newFile;
};

/**
 * List all files in a given folder.
 * 
 * @param {string} folder - The folder whose files are to be listed.
 * @returns {Promise<any[]>} An array of file records for the specified folder.
 */
export const listFiles = async (folder: string) => {
    return await File.find({ folder });
};

/**
 * Search for files based on various criteria.
 * 
 * @param {any} criteria - The search criteria that can include file name, folder, mime type, and size.
 * @returns {Promise<any[]>} An array of file records that match the search criteria.
 * @throws {Error} If an error occurs during the search process.
 */
export const searchFiles = async (criteria: {
    name?: string;
    folder?: string;
    mimeType?: string;
    minSize?: number;
    maxSize?: number;
  }) => {
    const query: any = {};
  
    // Dynamically build the query object
    if (criteria.name) {
      query.name = { $regex: criteria.name, $options: "i" }; // Case-insensitive match
    }
    if (criteria.folder) {
      query.folder = criteria.folder;
    }
    if (criteria.mimeType) {
      query.mimeType = criteria.mimeType;
    }
    if (criteria.minSize || criteria.maxSize) {
      query.size = {};
      if (criteria.minSize) query.size.$gte = criteria.minSize;
      if (criteria.maxSize) query.size.$lte = criteria.maxSize;
    }
  
    return File.find(query); // MongoDB query using Mongoose
  };

  export const listFilesByUser = async (folder: string, userId: string) => {
    return await File.find({ folder, uploadedBy: userId });
};



// import { request } from "express";
// import { extractUserId } from "../common/middleware/role-auth.middleware";
// import { File } from "./file.schema";
// import { uploadToCloudinary, deleteFromCloudinary } from "./file.util";

// export const uploadFile = async (file: Express.Multer.File, folder: string) => {
//     console.log("User Id")
//   console.log(request.user?._id,)
//   const result = await uploadToCloudinary(file.path, folder);

//   const newFile = await File.create({
//     name: file.originalname,
//     url: result.secure_url,
//     size: file.size,
//     folder,
//     mimeType: file.mimetype,
//     //uploadedBy: request.user?._id,
    
//   });
  

//   return newFile;
// };

// export const listFiles = async (folder: string) => {
//   return await File.find({ folder });
// };

// export const searchFiles = async (criteria: any) => {
//     try {
//       // Dynamically construct the search criteria
//       const searchCriteria: any = {};
  
//       // Add filters based on the criteria passed
//       if (criteria.name) {
//         searchCriteria.name = { $regex: criteria.name, $options: "i" }; // Case-insensitive
//       }
//       if (criteria.folder) {
//         searchCriteria.folder = criteria.folder;
//       }
//       if (criteria.mimeType) {
//         searchCriteria.mimeType = criteria.mimeType;
//       }
//       if (criteria.minSize || criteria.maxSize) {
//         searchCriteria.size = {};
//         if (criteria.minSize) searchCriteria.size.$gte = criteria.minSize;
//         if (criteria.maxSize) searchCriteria.size.$lte = criteria.maxSize;
//       }
  
//       // Perform search query
//       const files = await File.find(searchCriteria);
//       return files;
//     } catch (error) {
//       throw new Error("Error while searching files: " + error);
//     }
//   };

// // export const searchFiles = async (criteria: any) => {
// //     try {
      
// //       const files = await File.find(criteria);
// //       return files;
// //     } catch (error) {
// //       throw new Error('Error while searching files: ' + error);
// //     }
// //   };
// // export const deleteFile = async (fileId: string) => {
// //   const file = await File.findById(fileId);
// //   if (file) {
// //     await deleteFromCloudinary(file.url.split("/").pop()?.split(".")[0] || "");
// //     await file.remove();
// //   }
// //};
