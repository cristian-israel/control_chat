import { Client, LocalAuth } from "whatsapp-web.js";
import { globalConfig } from "../config/global";
import { generateQRCode } from "../app/messages";

export async function initBotTest(sessionName: string) {
  try {
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: "test-" + sessionName,
        dataPath: globalConfig.cacheDir,
      }),
      puppeteer: {
        headless: "chrome",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-extensions",
          "--disable-gpu",
          // "--single-process",
          // "--no-zygote",
        ],
      },
    });

    client.on("qr", (qr) => {
      // Generate and scan this code with your phone
      console.log("Generate QR tests:");
      generateQRCode(qr);
    });

    client.on("ready", () => {
      console.log("Client is ready!");
    });

    client.on("loading_screen", (percent, message) => {
      console.log(`⌛ Carregando: ${percent}% - ${message}`);
    });

    client.on("disconnected", (reason) => {
      console.log("❌ Desconectado:", reason);
    });

    client.on("message", async (msg) => {
      console.log(`[MSG] ${msg.from}: ${msg.body}`);

      if (msg.body === "!ping") {
        console.log("↪️ Recebi !ping, tentando responder...");
        await msg.reply("pong");
      }
    });

    client.on("authenticated", () => {
      console.log("Client authenticated!");
    });

    try {
      await client.initialize();
    } catch (err) {
      console.error("Erro no initialize:", err);
    }
  } catch (error) {
    console.error("Erro ao iniciar o bot de teste:", error);
  }
}
