import { Client } from "whatsapp-web.js";
import { getContactName } from "../utils";
import { ModelsWhatsapp } from "../../config/db/db.models";
import { shouldIgnoreMessage } from "../filters/shouldIgnoreMessage";

export default function onMessageRevoke(client: Client) {
  client.on("message_revoke_everyone", async (message, revokedMsg) => {
    if (
      shouldIgnoreMessage({
        message,
        message_type: "revoked",
        chat_type: ["c"],
      })
    )
      return;

    const chatIdAdmin = process.env.CHAT_ID_ADMIN as string;
    const name = await getContactName(client, message.from);
    const msgContent =
      revokedMsg?.body || "Não foi possível recuperar a mensagem";

    await client.sendMessage(
      chatIdAdmin,
      `🗑️ Mensagem apagada por *${name}*: _"${msgContent}"_`
    );

    await ModelsWhatsapp.Messages.create({
      id: message.id.id,
      type: "message_edit",
      message: revokedMsg?.body ?? null,
      extra: revokedMsg ? null : "Não foi possível recuperar a mensagem",
      from: message.from,
    });
  });
}
