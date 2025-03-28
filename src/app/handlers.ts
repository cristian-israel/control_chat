import { Client, Message } from "whatsapp-web.js";
import { generateQRCode } from "./messages";

export function setupHandlers(client: Client) {
  // Gera QR Code
  client.on("qr", generateQRCode);

  // Conexão estabelecida
  client.once("ready", () => {
    console.log("✅ Bot conectado ao WhatsApp!");
  });

  // Escuta mensagens recebidas
  client.on("message", async (message) => {
    if (message.type !== "chat") return;

    console.log(`📩 Mensagem recebida: ${message.body}`);
    await handleMessage(client, message);
  });
}
function handleMessage(client: Client, message: Message) {
  throw new Error("Function not implemented.");
}

