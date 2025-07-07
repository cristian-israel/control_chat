import { Client } from "whatsapp-web.js";
import { logSession } from "../utils";

export default function onReady(client: Client) {
  client.once("ready", async () => {
    const chatIdAdmin = process.env.CHAT_ID_ADMIN as string;
    await logSession(client, chatIdAdmin, "✅ Bot conectado ao WhatsApp!");
  });
}
