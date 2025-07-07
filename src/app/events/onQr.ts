import { Client } from "whatsapp-web.js";
import { generateQRCode } from "../messages";

export default function onQr(client: Client) {
  client.on("qr", generateQRCode);
}
