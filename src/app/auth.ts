import { Client, LocalAuth } from "whatsapp-web.js";
import { globalConfig } from "../config/global";

export function initAuth(name_session: string): Client {
  return new Client({
    authStrategy: new LocalAuth({
      clientId: name_session,
      dataPath: `${globalConfig.cacheDir}/${name_session}`,
    }),
    qrMaxRetries: 3,
  });
}
