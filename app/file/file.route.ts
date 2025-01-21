import { Router } from "express";
import multer from "multer";
import { uploadFile, listUserFiles, searchFiles } from "./file.controller";
import { roleAuth, extractUserId } from "../common/middleware/role-auth.middleware";
import { compressFile } from "../common/middleware/file-middleware";
import { validateSearchCriteria } from "../common/middleware/file-middleware";

// Configure Multer for temporary file storage
const upload = multer({ dest: "uploads/" });

const router = Router();

/**
 * POST /upload
 * This route handles file upload requests. It involves role-based authentication, file compression,
 * and calls the file upload controller function.
 * 
 * @param {Request} req - The request object containing the file and other parameters.
 * @param {Response} res - The response object to send back the success message and file details.
 * @param {NextFunction} next - The next middleware function to be called in case of an error.
 * @returns {void} This sends a response after file is uploaded and saved.
 * 
 * Middlewares:
 * - roleAuth("USER"): Ensures only users with the "USER" role can upload files.
 * - upload.single("file"): Uses multer to handle single file upload.
 * - compressFile: Middleware that compresses the file if necessary.
 * - uploadFile: Controller method that handles file storage and creation.
 */
router.post(
    "/upload",
    roleAuth("USER"),                   // Middleware for role-based access
    upload.single("file"),              // Use multer's single file upload middleware
    compressFile,                       // Compress file if necessary
    uploadFile                          // Controller to save file details
);

/**
 * GET /
 * This route fetches a list of files for the provided folder.
 * 
 * @param {Request} req - The request object containing the folder query parameter.
 * @param {Response} res - The response object to send back the list of files.
 * @returns {void} A response with a list of files, or a message indicating an empty folder.
 */
router.get("/", extractUserId, listUserFiles);

/**
 * POST /search
 * Allows searching files based on criteria like name, folder, MIME type, and size.
 */
router.post("/search", extractUserId, validateSearchCriteria, searchFiles);                                    

// Exports the router to use in the app
export default router;


// import { Router } from "express";
// import multer from "multer";
// import { uploadFile, listFiles, searchFiles  } from "./file.controller";
// import { roleAuth,extractUserId } from "../common/middleware/role-auth.middleware";
// import { compressFile } from "../common/middleware/file-middleware";

// // const upload = multer({ dest: "uploads/" }); // Temporary storage for files

// // const router = Router();

// // router.post("/upload",roleAuth("USER"),
// // (req, res, next) => upload(req, res, next), // Handle file upload
// //     compressFile, // Compress the file if necessary
// //     uploadFile)
// // Configure Multer for temporary file storage
// const upload = multer({ dest: "uploads/" }); 

// const router = Router();

// // File upload route with compression and authentication
// router.post(
//     "/upload",
//     roleAuth("USER"),                   // Middleware for role-based access
//     upload.single("file"),              // Use multer's single file upload middleware
//     compressFile,                       // Compress file if necessary
//     uploadFile                          // Controller to save file details
//     )
//     .get("/", listFiles)
//     .post("/search", searchFiles);
// //router.delete("/:fileId", deleteFile);

// export default router;
