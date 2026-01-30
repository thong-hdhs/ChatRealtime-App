import fs from "fs";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 10, // 10MB for messages
    },
});

const ensureUploadsDir = () => {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
};

const saveBufferToLocal = (buffer, originalName) => {
    const uploadsDir = ensureUploadsDir();
    const ext = path.extname(originalName) || ".bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const fullPath = path.join(uploadsDir, fileName);
    fs.writeFileSync(fullPath, buffer);
    return fileName;
};

/**
 * Upload buffer to Cloudinary. If Cloudinary fails, fallback to saving locally.
 * @param {Buffer} buffer
 * @param {Object} options - cloudinary options, can include folder, resource_type, transformation, originalName
 * @param {import('express').Request} req - optional, used to build fallback URL
 */
export const uploadImageFromBuffer = (buffer, options = {}, req = null) => {
    return new Promise((resolve, reject) => {
        // If env forces local uploads, skip Cloudinary entirely and save locally.
        if (process.env.USE_LOCAL_UPLOADS === "true") {
            try {
                const originalName = options.originalName || "file.bin";
                const fileName = saveBufferToLocal(buffer, originalName);
                const host = req
                    ? `${req.protocol}://${req.get("host")}`
                    : process.env.SERVER_URL ||
                      `http://localhost:${process.env.PORT || 5001}`;
                const url = `${host}/uploads/${fileName}`;
                return resolve({
                    secure_url: url,
                    public_id: `local/${fileName}`,
                });
            } catch (fsErr) {
                console.error("Local fallback save error (forced):", fsErr);
                return reject(fsErr);
            }
        }
        const params = {
            folder: options.folder || "chat_app/avatars",
            resource_type: options.resource_type || "image",
            transformation: options.transformation || [
                { width: 200, height: 200, crop: "fill" },
            ],
            ...options,
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            params,
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);

                    // Fallback: save locally and return a result-like object
                    try {
                        const originalName = options.originalName || "file.bin";
                        const fileName = saveBufferToLocal(
                            buffer,
                            originalName,
                        );
                        const host = req
                            ? `${req.protocol}://${req.get("host")}`
                            : process.env.SERVER_URL ||
                              `http://localhost:${process.env.PORT || 5001}`;
                        const url = `${host}/uploads/${fileName}`;
                        return resolve({
                            secure_url: url,
                            public_id: `local/${fileName}`,
                        });
                    } catch (fsErr) {
                        console.error("Local fallback save error:", fsErr);
                        return reject(error);
                    }
                } else {
                    resolve(result);
                }
            },
        );

        uploadStream.end(buffer);
    });
};
