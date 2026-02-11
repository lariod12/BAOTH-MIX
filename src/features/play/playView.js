export function createPlayView({ onBack } = {}) {
  const shell = document.createElement("main");
  shell.className = "mobile-shell";

  const card = document.createElement("section");
  card.className = "mobile-card";

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Play";

  const subtitle = document.createElement("p");
  subtitle.className = "screen-subtitle";
  subtitle.textContent = "Game setup page is ready for the next step.";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "btn-option btn-play";
  backButton.textContent = "Back";

  backButton.addEventListener("click", () => {
    if (typeof onBack === "function") {
      onBack();
    }
  });

  card.append(title, subtitle, backButton);
  shell.appendChild(card);
  return shell;
}
