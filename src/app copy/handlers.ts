import { Client, LocalAuth } from "whatsapp-web.js";

export function initAuth(sessionName: string) {
  return new Client({
    authStrategy: new LocalAuth({
      clientId: sessionName,
      dataPath: "./.wwebjs_auth",
    }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });
}

export default async function initBot(sessionName: string) {
  const client = initAuth(sessionName);

  client.on("qr", (qr) => {
    console.log("QR Code recebido, escaneie com o WhatsApp:");
    console.log(qr);
  });

  client.on("ready", () => {
    console.log("Cliente pronto!");
  });

  client.on("auth_failure", (msg) => {
    console.error("Falha de autenticação:", msg);
  });

  client.on("disconnected", (reason) => {
    console.log("Cliente desconectado, motivo:", reason);
  });

  await client.initialize();

  return client;
}
