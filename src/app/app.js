import { createHomeView } from "../features/home/homeView.js";
import { createPlayStartView, createPlayView } from "../features/play/playView.js";
import {
  createCardsView,
  createExploreStoryView,
  createReferenceView,
  createRulesView,
  createTutorialMenuView
} from "../features/tutorial/tutorialViews.js";
import { byId } from "../utils/dom.js";

const ROUTES = {
  HOME: "home",
  PICK_CHARACTER: "pick-character",
  PLAY_START: "play-start",
  TUTORIAL: "tutorial",
  RULES: "rules",
  EXPLORE_STORY: "explore-story",
  REFERENCE: "reference",
  CARDS: "cards"
};

export function initApp() {
  const root = byId("app");
  if (!root) {
    throw new Error("Missing #app root element.");
  }

  let routeState = {};

  function navigate(route, state = {}) {
    routeState = state;
    root.innerHTML = "";

    if (route === ROUTES.PICK_CHARACTER) {
      root.appendChild(
        createPlayView({
          onBack: () => navigate(ROUTES.HOME),
          onStart: (characterId) => navigate(ROUTES.PLAY_START, { characterId })
        })
      );
      return;
    }

    if (route === ROUTES.PLAY_START) {
      root.appendChild(
        createPlayStartView({
          characterId: routeState.characterId,
          onBack: () => navigate(ROUTES.PICK_CHARACTER)
        })
      );
      return;
    }

    if (route === ROUTES.TUTORIAL) {
      root.appendChild(
        createTutorialMenuView({
          onBack: () => navigate(ROUTES.HOME),
          onRules: () => navigate(ROUTES.RULES),
          onReference: () => navigate(ROUTES.REFERENCE),
          onCards: () => navigate(ROUTES.CARDS),
          onExploreStory: () => navigate(ROUTES.EXPLORE_STORY)
        })
      );
      return;
    }

    if (route === ROUTES.RULES) {
      root.appendChild(createRulesView({ onBack: () => navigate(ROUTES.TUTORIAL) }));
      return;
    }

    if (route === ROUTES.EXPLORE_STORY) {
      root.appendChild(createExploreStoryView({ onBack: () => navigate(ROUTES.TUTORIAL) }));
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
        onPlay: () => navigate(ROUTES.PICK_CHARACTER),
        onTutorial: () => navigate(ROUTES.TUTORIAL)
      })
    );
  }

  navigate(ROUTES.HOME);
}
