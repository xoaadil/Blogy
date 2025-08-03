import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "blogy_uploads",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: file.originalname.split(".")[0], // optional
    };
  },
});

const upload = multer({ storage });

export default upload;
