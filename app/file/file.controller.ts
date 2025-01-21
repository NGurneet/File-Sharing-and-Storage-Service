import asyncHandler from "express-async-handler";
import * as fileService from "./file.service";
import { NextFunction, Request, Response } from "express";
import { createResponse } from "../common/helper/response.hepler";
import mongoose from "mongoose";

/**
 * Handles file upload request. 
 * Uploads a file to the server and stores it in a Cloud storage service.
 * 
 * @param {Request} req - The request object, containing the file to be uploaded and optional folder parameter.
 * @param {Response} res - The response object to send back the result of the file upload.
 * @returns {Promise<void>} A promise resolving when the file has been uploaded, or an error message if no file is provided.
 */
// export const uploadFile = asyncHandler( async (req: Request, res: Response): Promise<void> => {
//   if (!req.file) {
//     res.status(400).send(createResponse(null, "No file provided"));
//     return;
//   }

//   const folder = req.body.folder || "default";
//   const fileData = await fileService.uploadFile(req.file, folder);

//   res.status(201).send(createResponse(fileData, "File uploaded successfully"));
// });

export const uploadFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Check if file is present
  if (!req.file) {
        res.status(400).send(createResponse(null, "No file provided"));
        return;
      }

  // Ensure 'folder' field exists, defaulting to "default" if not provided
  const folder = req.body.folder || "default";

  // Check if 'userId' exists in request (assumes user is authenticated)
  const userId = req.user?._id
  if (!userId) {
     res.status(400).send(createResponse(null, "User not authenticated"));
     return;
  }

  // Prepare file data including userId (uploadedBy)
  const fileData = await fileService.uploadFile(req.file, folder, userId );

  // Respond with success
  res.status(201).send(createResponse(fileData, "File uploaded successfully"));
});


/**
 * Handles listing all files in the specified folder.
 * Fetches files from the server or database by folder name.
 * 
 * @param {Request} req - The request object containing the folder query parameter.
 * @param {Response} res - The response object to send back the list of files.
 * @returns {Promise<void>} A promise resolving with the file list, or an error message if no files are found.
 */
export const listFiles = asyncHandler(async (req: Request, res: Response) => {
  const folder = req.query.folder as string || "default";
  const files = await fileService.listFiles(folder);

  res.status(200).send(createResponse(files, "Files retrieved successfully"));
});

export const listUserFiles = asyncHandler(async (req: Request, res: Response) => {
  const folder = req.query.folder as string || "default";
  const userId = req.user?._id; // Extracting the userId from the authenticated user

  const files = await fileService.listFilesByUser(folder, userId as string);

  res.status(200).send(createResponse(files, "Files retrieved successfully"));
});

/**
 * Handles the search for files based on specific search criteria.
 * Allows filtering by name, folder, mime type, and file size.
 * 
 * @param {Request} req - The request object containing the search criteria as body parameters.
 * @param {Response} res - The response object to send back the search results.
 * @returns {Promise<void>} A promise resolving with the list of files matching the search criteria, or a message if no files are found.
 */
  export const searchFiles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, folder, mimeType, minSize, maxSize } = req.body;

    // Build the search criteria object
    const criteria = {
      name,
      folder,
      mimeType,
      minSize: minSize ? parseInt(minSize) : undefined,
      maxSize: maxSize ? parseInt(maxSize) : undefined,
    };

    const files = await fileService.searchFiles(criteria);

    if (!files.length) {
      res.status(404).send(createResponse(null, "No files found for the given criteria."));
      return;
    }

    res.status(200).send(createResponse(files, "Files retrieved successfully."));
  });


// import asyncHandler from "express-async-handler";
// import * as fileService from "./file.service";
// import { NextFunction, Request, Response } from "express";
// import { createResponse } from "../common/helper/response.hepler";

// export const uploadFile = asyncHandler( async (req: Request, res: Response): Promise<void> => {
//   if (!req.file) {
//     res.status(400).send(createResponse(null, "No file provided"));
//     return;
//   }

//   const folder = req.body.folder || "default";
//   const fileData = await fileService.uploadFile(req.file, folder);

//   res.status(201).send(createResponse(fileData, "File uploaded successfully"));
// });


// export const listFiles = asyncHandler(async (req: Request, res: Response) => {
//   const folder = req.query.folder as string || "default";
//   const files = await fileService.listFiles(folder);

//   res.status(200).send(createResponse(files, "Files retrieved successfully"));
// });

// // export const searchFiles = asyncHandler(async (req: Request, res: Response) : Promise<void> => {
// //     const { query } = req.body;  // Search query parameter
// //     const { folder } = req.body;  // Optional folder parameter
  
// //     // Search criteria (name and folder as an example)
// //     const searchCriteria: any = {};
// //     if (query) {
// //       searchCriteria.name = { $regex: query, $options: 'i' };  // Case-insensitive search by name
// //     }
// //     if (folder) {
// //       searchCriteria.folder = folder;
// //     }
  
// //     // Fetch files based on search criteria
// //     const files = await fileService.searchFiles(searchCriteria);
  
// //     if (files.length === 0) {
// //       res.status(203).send("No File Found");
// //     }
  
// //     res.status(200).json(files);
// //   });

//   export const searchFiles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//     const { name, folder, mimeType, minSize, maxSize } = req.body;
  
//     // Build criteria object
//     const criteria = {
//       name,
//       folder,
//       mimeType,
//       minSize: minSize ? parseInt(minSize) : undefined,
//       maxSize: maxSize ? parseInt(maxSize) : undefined,
//     };
  
//     // Fetch files based on the provided criteria
//     const files = await fileService.searchFiles(criteria);
  
//     if (files.length === 0) {
//       res.status(203).send(createResponse(null, "No files found"));
//       return;
//     }
  
//     res.status(200).send(createResponse(files, "Files retrieved successfully"));
//   });
  

// // export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
// //   const fileId = req.params.fileId;
// //   await fileService.deleteFile(fileId);

// //   res.status(200).send(createResponse(null, "File deleted successfully"));
// // });
