import { Client, Message } from "whatsapp-web.js";
import { generateQRCode, handleMessage } from "./messages";

const chat_id_admin = process.env.CHAT_ID_ADMIN as string;

export function setupHandlers(client: Client) {
  client.on("qr", generateQRCode);

  client.once("ready", () => {
    client.sendMessage(chat_id_admin, `✅ Bot conectado ao WhatsApp!`);
  });

  client.on("auth_failure", (message: String) => {
    client.sendMessage(chat_id_admin, `❌ Erro de autenticação: ${message}`);
  })

  client.on("disconnected", (reason: String) => {
    client.sendMessage(chat_id_admin, `❌ Bot desconectado: ${reason}`);
  })

  // Monitoramento de mensagens recebidas
  // client.on("message", async (message: Message) => {
  //   if (shouldIgnoreMessage(message, "chat")) return;

  //   await handleMessage(client, message);
  // });

  // Monitoramento de mensagens editadas
  client.on("message_edit", async (message: Message, newBody: string, prevBody: string) => {
    if (shouldIgnoreMessage(message, "chat")) return;
    client.sendMessage(chat_id_admin, `Mensagem editada por *${await getContactName(client, message.from)}:*🔹 Antes: _"${prevBody}"_🔹 Agora: _"${newBody}"_`);
  });

  // Monitoramento de mensagens excluídas
  client.on("message_revoke_everyone", async (message: Message, revoked_msg?: Message) => {
    if (shouldIgnoreMessage(message, "revoked")) return;

    if (revoked_msg) {
      client.sendMessage(chat_id_admin, `Mensagem apagada por *${await getContactName(client, message.from)}:* _"${revoked_msg.body}"_`);
    } else {
      client.sendMessage(chat_id_admin, `Mensagem apagada por *${await getContactName(client, message.from)}:* _{ Conteúdo não pôde o conteúdo não pôde ser recuperado. }_`);
    }
  });
}

// Verifica se a mensagem deve ser ignorada pelo bot.
function shouldIgnoreMessage(message: Message, type: String): boolean {
  return (
    message.type !== type ||
    message.fromMe ||
    message.isEphemeral ||
    message.isForwarded ||
    message.isGif ||
    message.isStarred ||
    message.isStatus ||
    message.hasMedia
  );
}

// Buscar o nome do contato
async function getContactName(client: Client, contact: string): Promise<string> {
  return await client.getContactById(contact).then(({ name }) => name || "Unknown Contact");
}
