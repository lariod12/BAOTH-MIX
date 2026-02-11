import { createHomeView } from "../features/home/homeView.js";
import { createPlayView } from "../features/play/playView.js";
import {
  createCardsView,
  createReferenceView,
  createRulesView,
  createTutorialMenuView
} from "../features/tutorial/tutorialViews.js";
import { byId } from "../utils/dom.js";

const ROUTES = {
  HOME: "home",
  PLAY: "play",
  TUTORIAL: "tutorial",
  RULES: "rules",
  REFERENCE: "reference",
  CARDS: "cards"
};

export function initApp() {
  const root = byId("app");
  if (!root) {
    throw new Error("Missing #app root element.");
  }

  function navigate(route) {
    root.innerHTML = "";

    if (route === ROUTES.PLAY) {
      root.appendChild(createPlayView({ onBack: () => navigate(ROUTES.HOME) }));
      return;
    }

    if (route === ROUTES.TUTORIAL) {
      root.appendChild(
        createTutorialMenuView({
          onBack: () => navigate(ROUTES.HOME),
          onRules: () => navigate(ROUTES.RULES),
          onReference: () => navigate(ROUTES.REFERENCE),
          onCards: () => navigate(ROUTES.CARDS)
        })
      );
      return;
    }

    if (route === ROUTES.RULES) {
      root.appendChild(createRulesView({ onBack: () => navigate(ROUTES.TUTORIAL) }));
      return;
    }

    if (route === ROUTES.REFERENCE) {
      root.appendChild(createReferenceView({ onBack: () => navigate(ROUTES.TUTORIAL) }));
      return;
    }

    if (route === ROUTES.CARDS) {
      root.appendChild(createCardsView({ onBack: () => navigate(ROUTES.TUTORIAL) }));
      return;
    }

    root.appendChild(
      createHomeView({
        onPlay: () => navigate(ROUTES.PLAY),
        onTutorial: () => navigate(ROUTES.TUTORIAL)
      })
    );
  }

  navigate(ROUTES.HOME);
}
