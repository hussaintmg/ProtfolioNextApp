import { v2 as cloudinaryLib } from "cloudinary";

cloudinaryLib.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (
  fileInput,
  folder,
  oldPublicId = null,
  resourceType = "image"
) => {
  try {
    if (oldPublicId) {
      try {
        await cloudinaryLib.uploader.destroy(oldPublicId, {
          resource_type: resourceType,
        });
      } catch (err) {
        console.warn("Failed to delete old file:", err.message);
      }
    }

    // For images, we use Buffer directly
    if (resourceType === "image" && Buffer.isBuffer(fileInput)) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinaryLib.uploader.upload_stream(
          { folder, resource_type: resourceType },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
        stream.end(fileInput);
      });

      return { url: result.secure_url, publicId: result.public_id };
    }

    // For videos, we use streaming upload to handle large files
    if (resourceType === "video" && fileInput instanceof ReadableStream) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinaryLib.uploader.upload_stream(
          { folder, resource_type: resourceType, chunk_size: 6_000_000 },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );

        const reader = fileInput.getReader();

        const pump = () =>
          reader.read().then(({ done, value }) => {
            if (done) return uploadStream.end();
            uploadStream.write(Buffer.from(value));
            return pump();
          });

        pump();
      });

      return { url: result.secure_url, publicId: result.public_id };
    }

    throw new Error("Invalid file input type for upload.");
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

export const cloudinary = cloudinaryLib;
