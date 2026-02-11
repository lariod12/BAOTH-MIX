import { createSocketClient } from "../services/socket/socketClient.js";
import { createHomeView } from "../features/home/homeView.js";
import { byId } from "../utils/dom.js";

export function initApp() {
  const root = byId("app");
  if (!root) {
    throw new Error("Missing #app root element.");
  }

  const socket = createSocketClient();
  root.innerHTML = "";
  root.appendChild(createHomeView(socket));
}
