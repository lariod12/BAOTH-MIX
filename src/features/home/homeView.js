export function createHomeView() {
  const shell = document.createElement("main");
  shell.className = "mobile-shell";

  const card = document.createElement("section");
  card.className = "mobile-card";

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Betrayal Arcade";

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
  tutorialButton.className = "btn-option btn-tutorial";
  tutorialButton.textContent = "Tutorial";

  menuOptions.append(playButton, tutorialButton);

  const tutorialPanel = document.createElement("div");
  tutorialPanel.className = "tutorial-panel is-hidden";
  tutorialPanel.innerHTML = "<strong>Tutorial:</strong> Explore, gather omens, and survive the haunt.";

  playButton.addEventListener("click", () => {
    tutorialPanel.classList.add("is-hidden");
  });

  tutorialButton.addEventListener("click", () => {
    tutorialPanel.classList.toggle("is-hidden");
  });

  card.append(title, subtitle, menuOptions, tutorialPanel);
  shell.appendChild(card);
  return shell;
}
