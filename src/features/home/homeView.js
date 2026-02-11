export function createHomeView({ onPlay, onTutorial } = {}) {
  const shell = document.createElement("main");
  shell.className = "mobile-shell";

  const card = document.createElement("section");
  card.className = "mobile-card";

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Betrayal At House on The Hill";

  const subtitle = document.createElement("p");
  subtitle.className = "screen-subtitle";
  subtitle.textContent = "Let's find out what happened. A hidden story awaits.";

  const menuOptions = document.createElement("div");
  menuOptions.className = "menu-options";

  const playButton = document.createElement("button");
  playButton.type = "button";
  playButton.className = "btn-option btn-play";
  playButton.textContent = "Play";

  const tutorialButton = document.createElement("button");
  tutorialButton.type = "button";
  tutorialButton.className = "btn-option btn-play";
  tutorialButton.textContent = "Tutorial";

  menuOptions.append(playButton, tutorialButton);

  playButton.addEventListener("click", () => {
    if (typeof onPlay === "function") {
      onPlay();
    }
  });

  tutorialButton.addEventListener("click", () => {
    if (typeof onTutorial === "function") {
      onTutorial();
    }
  });

  card.append(title, subtitle, menuOptions);
  shell.appendChild(card);
  return shell;
}
