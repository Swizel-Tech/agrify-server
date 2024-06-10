const {
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const getStream = async () => await import("get-stream");
// import getStream from "get-stream";
// const getStream = require("get-stream");
const config = require("../config.js");
const logger = require("./logger.js");
const ErrorHandler = require("./customError");
const { StatusCodes } = require("http-status-codes");

// Initialize a new instance of the S3Client class with the given configuration options
const awsS3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});

// Define an asynchronous function called uploadFile that takes a file and filename as parameters/ image/svg+xml"
const uploadFile = async (file, fileName, contentType = null) => {
  const params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ACL: "public-read",
  };

  if (contentType) params.ContentType = contentType;

  try {
    const { Location } = await new Upload({ client: awsS3, params }).done();
    logger.info(`File  ${fileName} uploaded`);
    return Location;
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler(
      `Failed to upload file ${fileName} to s3 bucket`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Gets uploaded files from aws
const getFile = async (fileName) => {
  const getObjectParams = { Bucket: config.AWS_BUCKET_NAME, Key: fileName };

  try {
    const getObjectCommand = new GetObjectCommand(getObjectParams);
    const { Body } = await awsS3.send(getObjectCommand);
    const objectData = await getStream.buffer(Body);
    return objectData;
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    throw new ErrorHandler(
      `Failed to fetch file ${fileName}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Deletes a file from aws
const deleteFile = async (fileName) => {
  const command = new DeleteObjectCommand({
    Bucket: config.AWS_BUCKET_NAME,
    Key: fileName,
  });

  try {
    return await awsS3.send(command);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { uploadFile, getFile, deleteFile, awsS3 };
