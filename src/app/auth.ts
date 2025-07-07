import { Client, LocalAuth } from "whatsapp-web.js";
import { globalConfig } from "../config/global";

export function initAuth(nameSession: string): Client {
  return new Client({
    authStrategy: new LocalAuth({
      clientId: nameSession,
      dataPath: `${globalConfig.cacheDir}/${nameSession}`,
    }),
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    qrMaxRetries: 3,
  });
}
