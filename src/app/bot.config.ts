import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

export default async function initBot({
  name_session,
}: {
  name_session: string;
}) {
  // Inicializa o cliente do WhatsApp
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: name_session,
      // dataPath: `./${name_session}`,
    }),
    qrMaxRetries: 3,
  });

  // Gera o QR Code para autenticação
  client.on("qr", (qr) => {
    console.log("Escaneie o QR Code abaixo para conectar:");
    qrcode.generate(qr, { small: true });
  });

  // Mensagem de sucesso ao conectar
  client.once("ready", () => {
    console.log("✅ Bot conectado ao WhatsApp!");
  });

  // Responde a mensagens recebidas
  client.on("message", async (message) => {
    if (message.type !== "chat") return;

    console.log(`📩 Mensagem recebida: ${message.body}`);

    if (message.body.toLowerCase() === "oi") {
      await message.reply("Olá! Como posso te ajudar?");
    }
  });

  // Inicia o bot
  client.initialize();
}
