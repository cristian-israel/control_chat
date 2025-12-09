import moment from "moment";
import { Client } from "whatsapp-web.js";

export async function logSession(
  client: Client,
  chatId: string,
  message: string
) {
  await client.sendMessage(chatId, message);
  console.log(`${moment().format("DD/MM/YYYY HH:mm:ss")} - ${message}`);
}

export async function getContactName(
  client: Client,
  contactId: string
): Promise<string> {
  try {
    const contact = await client.getContactById(contactId);
    return contact.name || "Contato Desconhecido";
  } catch (error) {
    return "Contato Desconhecido";
  }
}
