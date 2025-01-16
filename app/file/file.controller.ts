import asyncHandler from "express-async-handler";
import * as fileService from "./file.service";
import { NextFunction, Request, Response } from "express";
import { createResponse } from "../common/helper/response.hepler";

export const uploadFile = asyncHandler( async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).send(createResponse(null, "No file provided"));
    return;
  }

  const folder = req.body.folder || "default";
  const fileData = await fileService.uploadFile(req.file, folder);

  res.status(201).send(createResponse(fileData, "File uploaded successfully"));
});


export const listFiles = asyncHandler(async (req: Request, res: Response) => {
  const folder = req.query.folder as string || "default";
  const files = await fileService.listFiles(folder);

  res.status(200).send(createResponse(files, "Files retrieved successfully"));
});

// export const searchFiles = asyncHandler(async (req: Request, res: Response) : Promise<void> => {
//     const { query } = req.body;  // Search query parameter
//     const { folder } = req.body;  // Optional folder parameter
  
//     // Search criteria (name and folder as an example)
//     const searchCriteria: any = {};
//     if (query) {
//       searchCriteria.name = { $regex: query, $options: 'i' };  // Case-insensitive search by name
//     }
//     if (folder) {
//       searchCriteria.folder = folder;
//     }
  
//     // Fetch files based on search criteria
//     const files = await fileService.searchFiles(searchCriteria);
  
//     if (files.length === 0) {
//       res.status(203).send("No File Found");
//     }
  
//     res.status(200).json(files);
//   });

  export const searchFiles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, folder, mimeType, minSize, maxSize } = req.body;
  
    // Build criteria object
    const criteria = {
      name,
      folder,
      mimeType,
      minSize: minSize ? parseInt(minSize) : undefined,
      maxSize: maxSize ? parseInt(maxSize) : undefined,
    };
  
    // Fetch files based on the provided criteria
    const files = await fileService.searchFiles(criteria);
  
    if (files.length === 0) {
      res.status(203).send(createResponse(null, "No files found"));
      return;
    }
  
    res.status(200).send(createResponse(files, "Files retrieved successfully"));
  });
  

// export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
//   const fileId = req.params.fileId;
//   await fileService.deleteFile(fileId);

//   res.status(200).send(createResponse(null, "File deleted successfully"));
// });
