import { Client, LocalAuth } from "whatsapp-web.js";

export function initAuth(sessionName: string) {
  return new Client({
    authStrategy: new LocalAuth({
      clientId: sessionName, // nome da sessão, cria pasta .wwebjs_auth/sessionName
      dataPath: "./.wwebjs_auth", // pasta base para armazenar sessão
    }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    },
  });
}
