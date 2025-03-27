import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carregar variáveis de ambiente

// Variável estática para armazenar a conexão
let isConnected = false;

const connectDB = async () => {
  const URI = process.env.MONGO_URI; // Banco de dados

  if (!URI) {
    console.error("Erro: URI do MongoDB não informada.");
    process.exit(1); // Finaliza o processo se não houver URI
  }

  try {
    if (isConnected) {
      console.log("✅ Já está conectado ao MongoDB.");
      return; // Já está conectado, não precisa fazer nada
    }

    // Conectar ao banco de dados
    await mongoose.connect(URI);
    isConnected = true;

    console.log("✅ Conectado ao banco de dados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB", error);
    process.exit(1); // Finaliza o processo em caso de erro
  }
};

export default connectDB;
