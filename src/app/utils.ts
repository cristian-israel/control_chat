import { Client } from "whatsapp-web.js";
import moment from "moment";

function waitForClientReady(client: Client, timeoutMs = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((client as any).info?.wid) return resolve();

    const interval = 500;
    let waited = 0;

    const timer = setInterval(() => {
      if ((client as any).info?.wid) {
        clearInterval(timer);
        return resolve();
      }

      waited += interval;
      if (waited >= timeoutMs) {
        clearInterval(timer);
        return reject(new Error("Timeout esperando client.info.wid"));
      }
    }, interval);
  });
}

export async function logSession(
  client: Client,
  chatId: string,
  message: string
) {
  const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");
  try {
    await waitForClientReady(client);
    await client.sendMessage(chatId, message);
    console.log(`[${timestamp}] ${message}`);
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("Execution context was destroyed")
    ) {
      console.warn(
        `[${timestamp}] Puppeteer context destroyed. Retry em 5s...`
      );
      setTimeout(() => logSession(client, chatId, message), 5000);
    } else {
      console.error(
        `[${timestamp}] Erro ao enviar mensagem no logSession:`,
        err
      );
      console.log(`[${timestamp}] ${message}`);
    }
  }
}
