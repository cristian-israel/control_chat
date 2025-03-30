import dotenv from "dotenv";
import initDB from "./config/db/db.init";
import initBot from "./app/bot.config";

(async () => {
  dotenv.config();
  console.clear();

  // Iniciar banco de dados
  await initDB();

  // Iniciar Bot do WhatsApp
  await initBot("bot");
})();
