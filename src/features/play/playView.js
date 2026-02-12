import { EVENTS, ITEMS, OMENS } from "../../data_ref/cardsData.js";
import { CHARACTER_BY_ID, CHARACTERS } from "../../data_ref/charactersData.js";

const COLOR_LABELS = {
  red: "Red",
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
  white: "White",
  purple: "Purple"
};

const COLOR_HEX = {
  red: "#dc2626",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#ca8a04",
  white: "#e5e7eb",
  purple: "#9333ea"
};

function getLocalizedName(character) {
  return character?.name?.vi || character?.name?.en || character?.id || "Unknown";
}

function getCharacterInsight(character) {
  return character?.profile?.vi?.info || character?.profile?.en?.info || "";
}

export function createPlayView({ onBack, onStart } = {}) {
  const shell = document.createElement("main");
  shell.className = "mobile-shell";

  const card = document.createElement("section");
  card.className = "mobile-card";

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Pick Character";

  const subtitle = document.createElement("p");
  subtitle.className = "screen-subtitle";
  subtitle.textContent = "Chọn 1 nhân vật để xem toàn bộ insight của họ.";

  const picker = document.createElement("section");
  picker.className = "character-picker";

  const colorOrder = ["red", "blue", "green", "yellow", "white", "purple"];
  const sortedCharacters = [...CHARACTERS].sort((a, b) => {
    const colorDiff = colorOrder.indexOf(a.color) - colorOrder.indexOf(b.color);
    if (colorDiff !== 0) {
      return colorDiff;
    }

    return getLocalizedName(a).localeCompare(getLocalizedName(b), "vi");
  });

  let selectedCharacterId = null;
  let expandedCharacterId = null;
  let isReady = false;
  const characterNameById = new Map(sortedCharacters.map((character) => [character.id, getLocalizedName(character)]));

  const readyButton = document.createElement("button");
  readyButton.type = "button";
  readyButton.className = "btn-option btn-ready";
  readyButton.textContent = "Ready";
  readyButton.disabled = true;

  /** @type {Map<string, { cardEl: HTMLElement, detailEl: HTMLElement, statusEl: HTMLElement, toggleBtn: HTMLButtonElement }>} */
  const cardRecords = new Map();

  function syncReadyButton() {
    readyButton.disabled = selectedCharacterId === null;
    if (!selectedCharacterId) {
      readyButton.textContent = "Ready";
    } else if (isReady) {
      readyButton.textContent = "Cancel";
    } else {
      const selectedName = characterNameById.get(selectedCharacterId) || "Unknown";
      readyButton.textContent = `Choice: ${selectedName}`;
    }

    readyButton.classList.toggle("is-ready", isReady);
  }

  function syncCharacterState() {
    for (const [characterId, record] of cardRecords) {
      const isSelected = selectedCharacterId === characterId;
      const isExpanded = expandedCharacterId === characterId;
      record.cardEl.classList.toggle("is-selected", isSelected);
      record.cardEl.classList.toggle("is-expanded", isExpanded);
      record.cardEl.classList.toggle("is-ready", isSelected && isReady);
      record.cardEl.dataset.expanded = isExpanded ? "true" : "false";
      record.detailEl.classList.toggle("is-hidden", !isExpanded);
      record.statusEl.classList.toggle("is-hidden", !(isSelected && isReady));
      record.statusEl.textContent = "Selected";
      record.toggleBtn.textContent = isExpanded ? "View less" : "View more";
    }
  }

  function toggleCharacter(characterId) {
    if (isReady) {
      return;
    }

    selectedCharacterId = selectedCharacterId === characterId ? null : characterId;
    syncCharacterState();
    syncReadyButton();
  }

  function toggleCharacterInsight(characterId) {
    expandedCharacterId = expandedCharacterId === characterId ? null : characterId;
    syncCharacterState();
  }

  for (const character of sortedCharacters) {
    const characterCard = document.createElement("article");
    characterCard.className = "character-item";
    characterCard.dataset.expanded = "false";

    const header = document.createElement("div");
    header.className = "character-head";

    const colorDot = document.createElement("span");
    colorDot.className = "character-color-dot";
    colorDot.style.backgroundColor = COLOR_HEX[character.color] || "#6b7280";

    const nameWrap = document.createElement("div");
    nameWrap.className = "character-name-wrap";

    const name = document.createElement("p");
    name.className = "character-name";
    name.textContent = getLocalizedName(character);

    const color = document.createElement("p");
    color.className = "character-color";
    color.textContent = `Color: ${COLOR_LABELS[character.color] || character.color}`;

    const status = document.createElement("span");
    status.className = "character-status is-hidden";
    status.textContent = "Selected";

    nameWrap.append(name, color, status);

    const infoWrap = document.createElement("div");
    infoWrap.className = "character-info-wrap";
    infoWrap.append(colorDot, nameWrap);

    const viewMoreButton = document.createElement("button");
    viewMoreButton.type = "button";
    viewMoreButton.className = "character-expand-btn";
    viewMoreButton.textContent = "View more";

    header.append(infoWrap, viewMoreButton);

    const detail = document.createElement("p");
    detail.className = "character-detail is-hidden";
    detail.textContent = getCharacterInsight(character) || "No character insight available yet.";

    viewMoreButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleCharacterInsight(character.id);
    });

    characterCard.addEventListener("click", () => toggleCharacter(character.id));

    characterCard.append(header, detail);
    picker.appendChild(characterCard);
    cardRecords.set(character.id, {
      cardEl: characterCard,
      detailEl: detail,
      statusEl: status,
      toggleBtn: viewMoreButton
    });
  }

  const actions = document.createElement("div");
  actions.className = "play-actions";

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "btn-option btn-start is-hidden";
  startButton.textContent = "Start";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "btn-option btn-play";
  backButton.textContent = "Back";

  readyButton.addEventListener("click", () => {
    if (!selectedCharacterId) {
      return;
    }

    isReady = !isReady;
    syncCharacterState();
    syncReadyButton();
    startButton.classList.toggle("is-hidden", !(isReady && selectedCharacterId));
  });

  startButton.addEventListener("click", () => {
    if (!isReady || !selectedCharacterId) {
      return;
    }
    if (typeof onStart === "function") {
      onStart(selectedCharacterId);
    }
  });

  backButton.addEventListener("click", () => {
    if (typeof onBack === "function") {
      onBack();
    }
  });

  syncReadyButton();
  actions.append(readyButton, startButton, backButton);
  card.append(title, subtitle, picker, actions);
  shell.appendChild(card);
  return shell;
}

function createInventoryCard({ title, records }) {
  const block = document.createElement("article");
  block.className = "inventory-card";

  const heading = document.createElement("h3");
  heading.className = "inventory-card-title";
  heading.textContent = title;

  const count = document.createElement("p");
  count.className = "inventory-card-count";
  count.textContent = `Deck size: ${records.length}`;

  const preview = document.createElement("ul");
  preview.className = "inventory-card-preview";

  for (const record of records.slice(0, 3)) {
    const item = document.createElement("li");
    item.textContent = record?.name?.vi || record?.id || "Unknown";
    preview.appendChild(item);
  }

  const hint = document.createElement("p");
  hint.className = "inventory-card-hint";
  hint.textContent = "Inventory slot: Empty";

  block.append(heading, count, preview, hint);
  return block;
}

export function createPlayStartView({ characterId, onBack } = {}) {
  const character = CHARACTER_BY_ID[characterId];
  const shell = document.createElement("main");
  shell.className = "mobile-shell";

  const card = document.createElement("section");
  card.className = "mobile-card play-start-card";
  shell.appendChild(card);

  if (!character) {
    const title = document.createElement("h1");
    title.className = "screen-title";
    title.textContent = "Welcome the House on the Hill";

    const empty = document.createElement("p");
    empty.className = "screen-subtitle";
    empty.textContent = "Chưa có nhân vật được chọn.";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "btn-option btn-play";
    backButton.textContent = "Back";
    backButton.addEventListener("click", () => {
      if (typeof onBack === "function") {
        onBack();
      }
    });

    card.append(title, empty, backButton);
    return shell;
  }

  const title = document.createElement("h1");
  title.className = "screen-title";
  title.textContent = "Welcome the House on the Hill";

  card.style.setProperty("--character-accent", COLOR_HEX[character.color] || "#facc15");

  const name = document.createElement("h2");
  name.className = "start-character-name";
  name.textContent = getLocalizedName(character);

  const description = document.createElement("p");
  description.className = "start-character-description";
  description.textContent = getCharacterInsight(character) || "No character insight available yet.";

  const inventoryTitle = document.createElement("h2");
  inventoryTitle.className = "start-section-title";
  inventoryTitle.textContent = "Inventory";

  const inventoryGrid = document.createElement("section");
  inventoryGrid.className = "inventory-grid";
  inventoryGrid.append(
    createInventoryCard({ title: "Omen Cards", records: OMENS }),
    createInventoryCard({ title: "Event Cards", records: EVENTS }),
    createInventoryCard({ title: "Item Cards", records: ITEMS })
  );

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "btn-option btn-play";
  backButton.textContent = "Back";
  backButton.addEventListener("click", () => {
    if (typeof onBack === "function") {
      onBack();
    }
  });

  card.append(title, name, description, inventoryTitle, inventoryGrid, backButton);
  return shell;
}
