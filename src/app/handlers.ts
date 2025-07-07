import { Client, Message } from "whatsapp-web.js";
import { generateQRCode, handleMessage } from "./messages";
import { logSession } from "./utils";
import { ModelsWhatsapp } from "../config/db/db.models";

export function setupHandlers(client: Client) {
  const chatIdAdmin = process.env.CHAT_ID_ADMIN as string;
  if (!chatIdAdmin) {
    throw new Error("CHAT_ID_ADMIN não está definido no .env");
  }

  client.on("qr", generateQRCode);

  client.once("ready", async () => {
    console.log("Cliente pronto, aguardando 1s...");
    setTimeout(async () => {
      await logSession(client, chatIdAdmin, "✅ Bot conectado ao WhatsApp!");
    }, 1000);
  });

  client.on("auth_failure", async (msg: string) => {
    console.error("Falha na autenticação!", msg);
    await logSession(client, chatIdAdmin, `❌ Erro de autenticação: ${msg}`);
  });

  client.on("disconnected", async (reason: string) => {
    await logSession(client, chatIdAdmin, `❌ Bot desconectado: ${reason}`);
  });

  // Monitoramento de mensagens recebidas (exemplo)
  client.on("message", async (message: Message) => {
    if (shouldIgnoreMessage(message, "chat", ["c"])) return;
    await handleMessage(client, message);
  });

  client.on(
    "message_edit",
    async (message: Message, newBody: string, prevBody: string) => {
      if (
        !message?.id ||
        !message.from ||
        typeof newBody !== "string" ||
        typeof prevBody !== "string"
      ) {
        console.warn("Dados incompletos para mensagem editada");
        return;
      }

      if (shouldIgnoreMessage(message, "chat", ["c", "u"])) return;

      const nomeContato = await getContactName(client, message.from);

      // opcional enviar mensagem ao admin, ou só salvar no banco
      // await client.sendMessage(chatIdAdmin, `Mensagem editada por *${nomeContato}*:\nAntes: ${prevBody}\nAgora: ${newBody}`);

      await ModelsWhatsapp.Messages.create({
        id: message.id.id,
        type: "message_edit",
        message: newBody,
        prev_message: prevBody,
        from: message.from,
      });
    }
  );

  client.on(
    "message_revoke_everyone",
    async (message: Message, revoked_msg?: Message) => {
      if (shouldIgnoreMessage(message, "revoked", ["c", "u"])) return;

      const nomeContato = await getContactName(client, message.from);
      const conteudo = revoked_msg?.body ?? null;

      // opcional enviar mensagem ao admin
      // await client.sendMessage(chatIdAdmin, `Mensagem apagada por *${nomeContato}*: ${conteudo ?? "não foi possível recuperar"}`);

      await ModelsWhatsapp.Messages.create({
        id: message.id.id,
        type: "message_edit",
        message: conteudo,
        extra: conteudo ? null : "Não foi possível recuperar a mensagem",
        from: message.from,
      });
    }
  );
}

// Helper para ignorar mensagens irrelevantes
function shouldIgnoreMessage(
  message: Message,
  messageType: string,
  chatTypes: string[]
): boolean {
  return (
    message.type !== messageType ||
    message.fromMe ||
    message.isEphemeral ||
    message.isForwarded ||
    message.isGif ||
    message.isStarred ||
    message.isStatus ||
    message.hasMedia ||
    chatTypes.some((t) => message.from.includes(t))
  );
}

// Helper para pegar nome do contato
async function getContactName(
  client: Client,
  contactId: string
): Promise<string> {
  const contact = await client.getContactById(contactId);
  return contact.name || "Unknown Contact";
}
