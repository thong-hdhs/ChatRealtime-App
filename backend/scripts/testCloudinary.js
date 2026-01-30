import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: path.join(process.cwd(), ".env") });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary config seen:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY
        ? process.env.CLOUDINARY_API_KEY.slice(0, 4) + "****"
        : null,
});

// A tiny 1x1 PNG base64
const tinyPngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
const buffer = Buffer.from(tinyPngBase64, "base64");

const upload = async () => {
    try {
        const params = { folder: "chat_app/test", resource_type: "image" };

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                params,
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            uploadStream.end(buffer);
        });

        console.log("Upload succeeded:", result);
    } catch (err) {
        console.error("Upload failed:", err);
        process.exitCode = 2;
    }
};

upload();
