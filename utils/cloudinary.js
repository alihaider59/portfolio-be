const { Readable } = require("stream");
const cloudinary = require("../config/cloudinaryConfig");

async function uploadImage(buffer, options = {}) {
  const { folder = "portfolio", resourceType = "image" } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        ...(options.publicId && { public_id: options.publicId }),
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          url: result.secure_url,
        });
      },
    );
    const readStream = Readable.from(buffer);
    readStream.pipe(uploadStream);
  });
}

async function deleteImage(publicId, options = {}) {
  const { resourceType = "image" } = options;
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

module.exports = {
  uploadImage,
  deleteImage,
};
