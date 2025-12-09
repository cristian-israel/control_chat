import { Client, LocalAuth } from "whatsapp-web.js";
import { globalConfig } from "../config/global";

export function initAuth(sessionName: string): Client {
  return new Client({
    authStrategy: new LocalAuth({
      clientId: sessionName,
      dataPath: globalConfig.cacheDir,
    }),

    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });
}
