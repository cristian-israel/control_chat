import { Client, Message } from "whatsapp-web.js";
import { getContactName } from "../utils";
import { ModelsWhatsapp } from "../../config/db/db.models";

import { shouldIgnoreMessage } from "../filters/shouldIgnoreMessage";

export default function onMessageEdit(client: Client) {
  client.on(
    "message_edit",
    async (message: Message, newBody: string, prevBody: string) => {
      if (
        shouldIgnoreMessage({
          message,
          message_type: "chat",
          chat_type: ["c"],
        })
      )
        return;

      const chatIdAdmin = process.env.CHAT_ID_ADMIN as string;

      const name = await getContactName(client, message.from);
      await client.sendMessage(
        chatIdAdmin,
        `📝 Mensagem editada por *${name}*: 🔹 Antes: _"${prevBody}"_ 🔹 Agora: _"${newBody}"_`
      );

      // await ModelsWhatsapp.Messages.create({
      //   id: message.id.id,
      //   type: "message_edit",
      //   message: newBody,
      //   prev_message: prevBody,
      //   from: message.from,
      // });
    }
  );
}
