import multer from "multer";
import sharp from "sharp"; // For image compression
import fs from "fs";
import path from "path";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Ensure unique filenames
  },
});

// File type filtering
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed.")); // Reject file
  }
};

// Set up multer with size limit
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increase the limit temporarily to allow compression
  fileFilter,
}).single("file");

// // Middleware to handle file compression
// const compressFile = async (req: Request, res: Response, next: NextFunction) => {
//   if (!req.file) {
//     return res.status(400).send({ message: "No file provided" });
//   }

//   const { path: filePath, mimetype } = req.file;

//   try {
//     if (mimetype.startsWith("image/")) {
//       // Compress image using Sharp
//       const compressedPath = filePath.replace(/(\.\w+)$/, "-compressed$1");
//       await sharp(filePath)
//         .resize({ width: 1080 }) // Resize to 1080px width
//         .jpeg({ quality: 80 }) // Adjust JPEG quality
//         .toFile(compressedPath);

//       // Replace original file with compressed file
//       fs.unlinkSync(filePath);
//       req.file.path = compressedPath;
//     } else if (mimetype === "application/pdf") {
//       // Handle PDF compression (placeholder for now)
//       // Use a PDF library to reduce file size if needed
//       console.log("PDF compression is not implemented yet");
//     }

//     next();
//   } catch (error) {
//     console.error("Error compressing file:", error);
//     res.status(500).send({ message: "Error compressing file", error: error });
//   }
// };

//export { upload, compressFile };


// Middleware to handle file compression

// Middleware to validate search criteria
export const validateSearchCriteria = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    folder: Joi.string().optional(),
    mimeType: Joi.string().optional(),
    minSize: Joi.number().optional(),
    maxSize: Joi.number().optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: "Invalid search criteria", details: error.details });
  }

  next();
};
const compressFile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file provided" });
  }

  const { path: filePath, mimetype } = req.file;

  try {
    // Check if file is an image
    if (mimetype.startsWith("image/")) {
      // Generate a temporary compressed file path in a different directory
      const dir = path.dirname(filePath);
      const compressedPath = path.join(dir, `compressed-${path.basename(filePath)}`);

      // Use Sharp to compress the image and save it to the compressed path
      await sharp(filePath)
        .resize({ width: 1080 }) // Resize to a maximum width of 1080px
        .jpeg({ quality: 80 }) // Adjust JPEG quality
        .toFile(compressedPath); // Output file path

      // Replace the original file path with the compressed path
      fs.unlinkSync(filePath); // Delete the original file

      req.file.path = compressedPath; // Update the request with the new compressed file path
    }

    // Proceed if the file is not an image or no compression is needed
    next();
  } catch (error) {
    console.error("Error compressing file:", error);
    res.status(500).send({ message: "Error compressing file", error: error });
  }
};



export { compressFile };




