import { Client } from "whatsapp-web.js";

import { logSession } from "../utils";

export default function onDisconnected(client: Client) {
  client.on("disconnected", async (reason) => {
    const chatIdAdmin = process.env.CHAT_ID_ADMIN as string;
    await logSession(client, chatIdAdmin, `❌ Bot desconectado: ${reason}`);
  });
}
