function createShellCard() {
  const shell = document.createElement("main");
  shell.className = "mobile-shell";

  const card = document.createElement("section");
  card.className = "mobile-card";

  shell.appendChild(card);
  return { shell, card };
}

function createBackButton(onBack) {
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "btn-option btn-play";
  backButton.textContent = "Back";

  backButton.addEventListener("click", () => {
    if (typeof onBack === "function") {
      onBack();
    }
  });

  return backButton;
}

export function createTutorialMenuView({ onBack, onRules, onReference } = {}) {
  const { shell, card } = createShellCard();

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Tutorial";

  const subtitle = document.createElement("p");
  subtitle.className = "screen-subtitle";
  subtitle.textContent = "Choose the guide you want to open.";

  const options = document.createElement("div");
  options.className = "menu-options";

  const rulesButton = document.createElement("button");
  rulesButton.type = "button";
  rulesButton.className = "btn-option btn-play";
  rulesButton.textContent = "Rules";
  rulesButton.addEventListener("click", () => {
    if (typeof onRules === "function") {
      onRules();
    }
  });

  const referenceButton = document.createElement("button");
  referenceButton.type = "button";
  referenceButton.className = "btn-option btn-play";
  referenceButton.textContent = "Reference";
  referenceButton.addEventListener("click", () => {
    if (typeof onReference === "function") {
      onReference();
    }
  });

  options.append(rulesButton, referenceButton);
  card.append(title, subtitle, options, createBackButton(onBack));
  return shell;
}

export function createRulesView({ onBack } = {}) {
  const { shell, card } = createShellCard();

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Rules";

  const subtitle = document.createElement("p");
  subtitle.className = "screen-subtitle";
  subtitle.textContent = "Main game rules will be displayed on this page.";

  card.append(title, subtitle, createBackButton(onBack));
  return shell;
}

export function createReferenceView({ onBack } = {}) {
  const { shell, card } = createShellCard();

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Reference";

  const subtitle = document.createElement("p");
  subtitle.className = "screen-subtitle";
  subtitle.textContent = "Reference cards and quick lookup content will be here.";

  card.append(title, subtitle, createBackButton(onBack));
  return shell;
}
