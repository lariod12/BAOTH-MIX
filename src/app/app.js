import { createHomeView } from "../features/home/homeView.js";
import { byId } from "../utils/dom.js";

export function initApp() {
  const root = byId("app");
  if (!root) {
    throw new Error("Missing #app root element.");
  }

  root.innerHTML = "";
  root.appendChild(createHomeView());
}
