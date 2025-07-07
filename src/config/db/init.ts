import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carregar variáveis de ambiente

const initDB = async () => {
  const URI = process.env.MONGO_URI; // Banco de dados

  if (!URI) {
    console.error("Erro: URI do MongoDB não informada.");
    process.exit(1); // Finaliza o processo se não houver URI
  }

  try {
    // Conectar ao banco de dados
    await mongoose.connect(URI);

    console.log("✅ Conectado ao banco de dados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB", error);
    process.exit(1); // Finaliza o processo em caso de erro
  }
};

export default initDB;
