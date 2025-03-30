import { Client, Message } from "whatsapp-web.js";
import { generateQRCode, handleMessage } from "./messages";
import moment from "moment";
import { ModelsWhatsapp } from "../config/db/db.models";

export function setupHandlers(client: Client) {
  const chat_id_admin = process.env.CHAT_ID_ADMIN as string;

  client.on("qr", generateQRCode);

  client.once("ready", async () => {
    await logSession(client, chat_id_admin, `✅ Bot conectado ao WhatsApp!`);
  });

  client.on("auth_failure", async (message: String) => {
    await logSession(client, chat_id_admin, `❌ Erro de autenticação: ${message}`);

  })

  client.on("disconnected", async (reason: String) => {
    await logSession(client, chat_id_admin, `❌ Bot desconectado: ${reason}`);

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
    // message.id.id
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
function shouldIgnoreMessage(message: Message, type: string): boolean {
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

async function logSession(client: Client, chat_id: string, message: string) {
  await client.sendMessage(chat_id, message);
  console.log(`${moment().format("DD/MM/YYYY hh:mm:ss")} - ${message}`)
}