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
    // Replace após o @ pelo regex e ignorar os 2 primeiros caracteres
    return contactId.replace(/@.+/, "").slice(2) ?? "Contato Desconhecido";
  }
}
