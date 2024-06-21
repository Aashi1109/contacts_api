import config from "@src/config";
import { jnstringify } from "@src/lib/utils";
import logger from "@src/logger";
import { ICloudinaryImageUploadOptions } from "@src/types";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: config.cloudinary.apiKey,
  cloud_name: config.cloudinary.cloudName,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export const options: ICloudinaryImageUploadOptions = {
  user_filename: false,
  unique_filename: true,
  overwrite: false,
  resource_type: "auto",
  folder: config.cloudinary.folderPath,
};

export async function uploadFileToCloudinary(
  fileData: string | any,
  folder?: string,
): Promise<any> {
  try {
    if (folder) {
      folder = options.folder + `/${folder}`;
    } else {
      folder = options.folder;
    }
    folder ??= config.cloudinary.folderPath;
    return await cloudinary.uploader.upload(fileData, { ...options, folder });
  } catch (error) {
    logger.error(`Error uploading file: ${jnstringify(error)}`);
    throw error;
  }
}

export async function createUploader(
  callback?: (...args: any[]) => void,
  folder?: string,
): Promise<any> {
  try {
    if (folder) {
      folder = options.folder + `/${folder}`;
    } else {
      folder = options.folder;
    }
    folder ??= config.cloudinary.folderPath;
    return cloudinary.uploader.upload_stream({ ...options, folder }, callback);
  } catch (error) {
    logger.error(`Error uploading file: ${jnstringify(error)}`);
    throw error;
  }
}
