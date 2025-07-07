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

  async function sendMessageWithRetry(
    chatId: string,
    message: string,
    retries = 10,
    delayMs = 500
  ) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await client.sendMessage(chatId, message);
        console.log(`✅ Mensagem enviada para ${chatId}`);
        return;
      } catch (err) {
        console.warn(
          `⚠️ Tentativa ${attempt} de ${retries} para enviar mensagem falhou. Retentando em ${delayMs}ms...`
        );
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
    console.error(`❌ Não foi possível enviar mensagem para ${chatId} após ${retries} tentativas.`);
  }

  client.once("ready", async () => {
    console.log("✅ Cliente pronto!");
    await sendMessageWithRetry(chatIdAdmin, "🤖 Bot conectado ao WhatsApp!");
  });

  client.on("auth_failure", async (msg) => {
    console.error("❌ Falha na autenticação:", msg);
    await sendMessageWithRetry(chatIdAdmin, `❌ Falha na autenticação: ${msg}`);
  });

  client.on("disconnected", async (reason) => {
    console.warn("⚠️ Cliente desconectado:", reason);
    await sendMessageWithRetry(chatIdAdmin, `⚠️ Bot desconectado: ${reason}`);
  });

  client.on("message", async (message: Message) => {
    if (message.fromMe) return; // Ignorar mensagens enviadas pelo próprio bot
    console.log(`Mensagem recebida de ${message.from}: ${message.body}`);
  });
}
