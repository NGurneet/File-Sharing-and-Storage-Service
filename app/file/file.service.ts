import { request } from "express";
import { extractUserId } from "../common/middleware/role-auth.middleware";
import { File } from "./file.schema";
import { uploadToCloudinary, deleteFromCloudinary } from "./file.util";

export const uploadFile = async (file: Express.Multer.File, folder: string) => {
    console.log("User Id")
  console.log(request.user?._id,)
  const result = await uploadToCloudinary(file.path, folder);

  const newFile = await File.create({
    name: file.originalname,
    url: result.secure_url,
    size: file.size,
    folder,
    mimeType: file.mimetype,
    //uploadedBy: request.user?._id,
    
  });
  

  return newFile;
};

export const listFiles = async (folder: string) => {
  return await File.find({ folder });
};

export const searchFiles = async (criteria: any) => {
    try {
      // Dynamically construct the search criteria
      const searchCriteria: any = {};
  
      // Add filters based on the criteria passed
      if (criteria.name) {
        searchCriteria.name = { $regex: criteria.name, $options: "i" }; // Case-insensitive
      }
      if (criteria.folder) {
        searchCriteria.folder = criteria.folder;
      }
      if (criteria.mimeType) {
        searchCriteria.mimeType = criteria.mimeType;
      }
      if (criteria.minSize || criteria.maxSize) {
        searchCriteria.size = {};
        if (criteria.minSize) searchCriteria.size.$gte = criteria.minSize;
        if (criteria.maxSize) searchCriteria.size.$lte = criteria.maxSize;
      }
  
      // Perform search query
      const files = await File.find(searchCriteria);
      return files;
    } catch (error) {
      throw new Error("Error while searching files: " + error);
    }
  };

// export const searchFiles = async (criteria: any) => {
//     try {
      
//       const files = await File.find(criteria);
//       return files;
//     } catch (error) {
//       throw new Error('Error while searching files: ' + error);
//     }
//   };
// export const deleteFile = async (fileId: string) => {
//   const file = await File.findById(fileId);
//   if (file) {
//     await deleteFromCloudinary(file.url.split("/").pop()?.split(".")[0] || "");
//     await file.remove();
//   }
//};
