import { Router } from "express";
import multer from "multer";
import { uploadFile, listFiles, searchFiles  } from "./file.controller";
import { roleAuth,extractUserId } from "../common/middleware/role-auth.middleware";
import { compressFile } from "../common/middleware/file-middleware";

// const upload = multer({ dest: "uploads/" }); // Temporary storage for files

// const router = Router();

// router.post("/upload",roleAuth("USER"),
// (req, res, next) => upload(req, res, next), // Handle file upload
//     compressFile, // Compress the file if necessary
//     uploadFile)
// Configure Multer for temporary file storage
const upload = multer({ dest: "uploads/" }); 

const router = Router();

// File upload route with compression and authentication
router.post(
    "/upload",
    roleAuth("USER"),                   // Middleware for role-based access
    upload.single("file"),              // Use multer's single file upload middleware
    compressFile,                       // Compress file if necessary
    uploadFile                          // Controller to save file details
    )
    .get("/", listFiles)
    .post("/search", searchFiles);
//router.delete("/:fileId", deleteFile);

export default router;
