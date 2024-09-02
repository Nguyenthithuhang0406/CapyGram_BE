const httpStatus = require("http-status");
const { admin } = require("../../config/firebase.config");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

const uploadFiles = catchAsync(async (req, res, next) => {
  //co the khong can vi dung cho phan comment, co the khong co file
  // if (!req.files || req.files.length === 0) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Files is required!");
  // }

  const bucket = admin.storage().bucket();
  const uploadPromises = req.files.map((file) => {
    const folder = file.mimetype.startsWith("image") ? "images" : "videos";
    const blob = bucket.file(`CapyGram/${folder}/${Date.now()}/${file.originalname}`);
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


  const fileUrls = await Promise.all(uploadPromises);

  try {
    // req.body.media = fileUrls;
    // req.body.media = [...(req.body.media || []), ...fileUrls];
    //đang gắn fileUrls vào req và cập nhật ở createPost và updatePost, validation, 
    //cách khác là gắn vào media
    req.body.newUrls = fileUrls;
    next();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);

  }

});

module.exports = uploadFiles;