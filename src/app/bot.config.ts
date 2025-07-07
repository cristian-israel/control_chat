import { initAuth } from "./bot.auth";
import { setupHandlers } from "./bot.handlers";

export default async function initBot(sessionName: string) {
  const client = initAuth(sessionName);
  setupHandlers(client);
  await client.initialize();
  return client;
}
