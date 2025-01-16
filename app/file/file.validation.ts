import { body } from 'express-validator';

// Validation for file upload
export const fileUploadValidation = [
  // Check if the file is provided
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('No file provided');
    }
    return true;
  }),

  // Validate the file type (example: only allow images and PDFs)
  body('file').custom((value, { req }) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const mimeType = req.file?.mimetype;

    if (mimeType && !allowedMimeTypes.includes(mimeType)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed');
    }
    return true;
  }),

  // Validate the file size (example: file size must be less than 5MB)
  body('file').custom((value, { req }) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const fileSize = req.file?.size;

    if (fileSize && fileSize > maxSize) {
      throw new Error('File size exceeds the 5MB limit');
    }
    return true;
  }),

  // Validate folder (optional)
  body('folder').optional().isString().withMessage('Folder must be a string'),
];

