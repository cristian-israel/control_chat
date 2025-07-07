import qrcode from "qrcode-terminal";
import { Message, Client } from "whatsapp-web.js";

export function generateQRCode(qr: string) {
  console.log("📱 Escaneie o QR Code abaixo para conectar:");
  qrcode.generate(qr, { small: true });
}

export async function handleMessage(client: Client, message: Message) {
  const text = message.body.toLowerCase();

  const responses: { [key: string]: string } = {
    teste: "Olá! Estou funcionando corretamente.",
    // ajuda: "Claro! Aqui estão algumas opções: ...",
  };

  if (responses[text]) {
    await message.reply(responses[text]);
  }
}
