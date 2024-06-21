import app from "@src/app";
import logger from "@src/logger";
import connectDB from "@src/database/connectDB";
import config from "@src/config";

app.listen(+config.port, config.host, async () => {
  await connectDB();
  logger.info(`Server listening on ${config.port}`);
});
