import * as dotenv from "dotenv";

dotenv.config();

const config = {
  logDir: process.env.LOG_DIR,
  logLevel: process.env.LOG_LEVEL,
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 3000,
  dbUrl: process.env.MONGODB_URL,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    folderPath: "ContactsAPI",
  },
};
export default config;
