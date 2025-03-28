import { Client, Message } from "whatsapp-web.js";
import { generateQRCode, handleMessage } from "./messages";

export function setupHandlers(client: Client) {
  client.on("qr", generateQRCode);

  client.once("ready", () => {
    console.log("✅ Bot conectado ao WhatsApp!");
  });

  client.on("message", async (message: Message) => {
    if (
      message.type !== "chat" ||
      message.isEphemeral ||
      message.isForwarded ||
      message.isGif ||
      message.isStarred ||
      message.isStatus
    )
      return;

    // console.log(`📩 - ${message.from}: ${message.body}`);
    await handleMessage(client, message);
  });

  // Monitoramento de mensagens editadas
  client.on("message_edit", async (message: Message, newBody: string, prevBody: string) => {
    if (message.fromMe || message.type !== "chat") return;
    console.log(`📝 - ${message.from}: ${prevBody} -> ${newBody}`);
  });

  // Monitoramento de mensagens excluídas
  client.on("message_revoke_everyone", async (message: Message, revoked_msg: Message) => {
    if (message.fromMe || message.type !== "chat") return;

    if (revoked_msg) {
      console.log(`🗑️ - ${message.from}: ${revoked_msg}`);
    } else {
      console.log(`🗑️ - ${message.from}: {A mensagem não pôde ser recuperada.}`);
    }
  });

}
