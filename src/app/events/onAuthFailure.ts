import { Client } from "whatsapp-web.js";
import { logSession } from "../utils";

export default function onAuthFailure(client: Client) {
  client.on("auth_failure", async (message) => {
    const chatIdAdmin = process.env.CHAT_ID_ADMIN as string;
    await logSession(client, chatIdAdmin, `❌ Erro de autenticação: ${message}`);
  });
}
