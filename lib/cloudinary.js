import { v2 as cloudinaryLib } from "cloudinary";

cloudinaryLib.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (
  buffer,
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

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinaryLib.uploader.upload_stream(
        { folder, resource_type: resourceType },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
      stream.end(buffer);
    });

    return { url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

// Export the configured instance if needed elsewhere
export const cloudinary = cloudinaryLib;
