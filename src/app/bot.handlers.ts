import { Client } from "whatsapp-web.js";

import onReady from "./events/onReady";
import onQr from "./events/onQr";
import onAuthFailure from "./events/onAuthFailure";
import onDisconnected from "./events/onDisconnected";
import onMessageEdit from "./events/onMessageEdit";
import onMessageRevoke from "./events/onMessageRevoke";
import onMessage from "./events/onMessage";

export function setupHandlers(client: Client) {
  onQr(client);
  onReady(client);
  onAuthFailure(client);
  onDisconnected(client);
  onMessageEdit(client);
  onMessageRevoke(client);
  onMessage(client);
}
