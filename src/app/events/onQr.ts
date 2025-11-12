import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

export default function onQr(client: Client) {
  client.on("qr", (qr: string) => {
    console.log("📱 Escaneie o QR Code abaixo para conectar:");
    qrcode.generate(qr, { small: true });
  });
}
