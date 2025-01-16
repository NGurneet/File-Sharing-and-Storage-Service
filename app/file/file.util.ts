import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dadcbzu6u",
  api_key: "468259489439831",
  api_secret: "evgUJZhvz6gws8fl05fw-wFaXHw",
});

export const uploadToCloudinary = async (filePath: string, folder: string) => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result;
};

export const deleteFromCloudinary = async (publicId: string) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};
