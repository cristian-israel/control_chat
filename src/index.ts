import dotenv from "dotenv";
import initDB from "./db/db.config";
import initBot from "./app/bot.config";

(async () => {
  dotenv.config();
  console.clear();

  // Iniciar banco de dados
  await initDB();

  // Iniciar Bot do WhatsApp
  await initBot({ name_session: "teste" });
})();
