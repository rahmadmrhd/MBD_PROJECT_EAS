import app from "./app/app";
import logger from "./app/logging";
import dotenv from "dotenv";

dotenv.config();

app.listen(5000, () => {
  logger.info("Server running on port 5000 => http://localhost:5000");
});
