import { initAuth } from "./auth";
import { setupHandlers } from "./handlers";

export default async function initBot(sessionName: string) {
  const client = initAuth(sessionName);
  setupHandlers(client);
  await client.initialize();
}
