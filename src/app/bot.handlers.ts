import { Client, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

export function setupHandlers(client: Client) {
  const chatIdAdmin = process.env.CHAT_ID_ADMIN as string;
  if (!chatIdAdmin) {
    throw new Error("CHAT_ID_ADMIN não está definido no .env");
  }

  client.on("qr", (qr) => {
    console.log("📲 Escaneie o QR code para conectar:");
    qrcode.generate(qr, { small: true });
  });

  client.once("ready", async () => {
    console.log("✅ Cliente pronto!");
    // Exemplo de notificação ao admin
    await client.sendMessage(chatIdAdmin, "🤖 Bot conectado ao WhatsApp!");
  });

  client.on("auth_failure", async (msg) => {
    console.error("❌ Falha na autenticação:", msg);
    await client.sendMessage(chatIdAdmin, `❌ Falha na autenticação: ${msg}`);
  });

  client.on("disconnected", async (reason) => {
    console.warn("⚠️ Cliente desconectado:", reason);
    await client.sendMessage(chatIdAdmin, `⚠️ Bot desconectado: ${reason}`);
  });

  // Aqui você pode configurar os eventos de mensagens e outros
  client.on("message", async (message: Message) => {
    if (message.fromMe) return; // Ignorar mensagens enviadas pelo próprio bot
    // Lógica para tratar mensagens
    console.log(`Mensagem recebida de ${message.from}: ${message.body}`);
  });
}
