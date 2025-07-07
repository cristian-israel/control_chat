import dotenv from "dotenv";
import initDB from "./config/db/init";
import initBot from "./app/bot";

dotenv.config();

(async () => {
  console.clear();
  await initDB();
  await initBot("bot");
})();
