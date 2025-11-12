import { Client, Message } from "whatsapp-web.js";
import { getContactName } from "../utils";
import { ModelsWhatsapp } from "../../config/db/db.models";

import { shouldIgnoreMessage } from "../filters/shouldIgnoreMessage";

export default function onMessage(client: Client) {
  client.on("message", async (message: Message) => {
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
      `opa! nova mensagem de *${name}*:\n\n${message.body}`
    );

    // await ModelsWhatsapp.Messages.create({
    //   id: message.id.id,
    //   type: "message",
    //   message: newBody,
    //   prev_message: prevBody,
    //   from: message.from,
    // });
  });
}
