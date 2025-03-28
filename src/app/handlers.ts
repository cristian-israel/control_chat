import { Client, Message } from "whatsapp-web.js";
import { generateQRCode, handleMessage } from "./messages";

export function setupHandlers(client: Client) {
  client.on("qr", generateQRCode);

  client.once("ready", () => {
    console.log("✅ Bot conectado ao WhatsApp!");
  });

  // Monitoramento de mensagens recebidas
  client.on("message", async (message: Message) => {
    if (shouldIgnoreMessage(message, "chat")) return;

    await handleMessage(client, message);
  });

  // Monitoramento de mensagens editadas
  client.on("message_edit", async (message: Message, newBody: string, prevBody: string) => {
    if (shouldIgnoreMessage(message, "chat")) return;

    console.log(`✏️ Mensagem editada por ${formatContact(message.from)}:🔹 Antes: "${prevBody}"🔹 Agora: "${newBody}"`);
  });

  // Monitoramento de mensagens excluídas
  client.on("message_revoke_everyone", async (message: Message, revoked_msg?: Message) => {
    if (shouldIgnoreMessage(message, "revoked")) return;

    if (revoked_msg) {
      console.log(`🗑️ Mensagem apagada por ${formatContact(message.from)}: "${revoked_msg.body}"`);
    } else {
      console.log(`🗑️ Mensagem apagada por ${formatContact(message.from)}, mas o conteúdo não pôde ser recuperado.`);
    }
  });
}

/**
 * Verifica se a mensagem deve ser ignorada pelo bot.
 */
function shouldIgnoreMessage(message: Message, type: String): boolean {
  return (
    message.type !== type ||
    message.fromMe ||
    message.isEphemeral ||
    message.isForwarded ||
    message.isGif ||
    message.isStarred ||
    message.isStatus
  );
}

/**
 * Formata o número do contato para exibição.
 */
function formatContact(contact: string): string {
  return contact.replace("@c.us", ""); // Remove o sufixo do WhatsApp
}
''