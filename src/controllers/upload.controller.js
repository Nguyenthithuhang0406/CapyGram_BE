const httpStatus = require("http-status");
const { admin } = require("../../config/firebase.config");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

const uploadImages = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Avatar is required!");
  }

  const bucket = admin.storage().bucket();
  const uploadPromises = req.files.map((file) => {
    const blob = bucket.file(`CapyGram/${Date.now()}/${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", (error) => {
        reject(error);
      });

      blobStream.on("finish", () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket.name)}/o/${encodeURIComponent(blob.name)}?alt=media`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  });

  const imageUrls = await Promise.all(uploadPromises);

  return res.status(httpStatus.OK).json({
    message: "Upload avatar successfully!",
    code: httpStatus.OK,
    data: {
      imageUrls,
    },
  });
});

module.exports = uploadImages;