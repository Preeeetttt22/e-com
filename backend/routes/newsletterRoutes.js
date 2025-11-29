import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs/promises";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "newsletter-images",
    });

    await fs.unlink(req.file.path); // delete local temp file

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;