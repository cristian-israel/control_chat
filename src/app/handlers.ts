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
  //   if (shouldIgnoreMessage({ message, message_type: "chat", chat_type: ["c"] })) return;

  //   await handleMessage(client, message);
  // });

  // Monitoramento de mensagens editadas
  client.on("message_edit", async (message: Message, newBody: string, prevBody: string) => {
    if (shouldIgnoreMessage({ message, message_type: "chat", chat_type: ["c"] })) return;
    client.sendMessage(chat_id_admin, `Mensagem editada por *${await getContactName(client, message.from)}:*🔹 Antes: _"${prevBody}"_🔹 Agora: _"${newBody}"_`);
    await ModelsWhatsapp.Messages.create({
      id: message.id.id,
      type: "message_edit",
      message: newBody,
      prev_message: prevBody,
      from: message.from,
    })
  });

  // Monitoramento de mensagens excluídas
  client.on("message_revoke_everyone", async (message: Message, revoked_msg?: Message) => {
    if (shouldIgnoreMessage({ message, message_type: "revoked", chat_type: ["c"] })) return;
    client.sendMessage(chat_id_admin, `Mensagem apagada por *${await getContactName(client, message.from)}:* _"${revoked_msg ? revoked_msg.body : "Não foi possível recuperar a mensagem"}"_`);
    await ModelsWhatsapp.Messages.create({
      id: message.id.id,
      type: "message_edit",
      message: revoked_msg ? revoked_msg.body : null,
      extra: revoked_msg ? null : "Não foi possível recuperar a mensagem",
      from: message.from,
    })
  });
}

// Verifica se a mensagem deve ser ignorada pelo bot.
function shouldIgnoreMessage({ message, message_type, chat_type }: { message: Message; message_type: string; chat_type: string[] }): boolean {
  return (
    message.type !== message_type ||
    message.fromMe ||
    message.isEphemeral ||
    message.isForwarded ||
    message.isGif ||
    message.isStarred ||
    message.isStatus ||
    message.hasMedia ||
    chat_type.some(chatType => message.from.includes(chatType))
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