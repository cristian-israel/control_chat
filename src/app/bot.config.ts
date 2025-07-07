import { initAuth } from "./auth";
import { setupHandlers } from "./handlers";

export default async function initBot(name_session: string) {
  const client = initAuth(name_session);
  setupHandlers(client);
  client.initialize();
}
