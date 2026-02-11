import rulesContent from "../../../rules.md?raw";

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

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseRuleSections(content) {
  const lines = content.split(/\r?\n/);
  const sections = [];
  let current = null;
  let sectionIndex = 0;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const headingLevel = headingMatch[1].length;
      const headingTitle = headingMatch[2].trim();

      if (current) {
        sections.push(current);
      }

      current = {
        id: `${slugify(headingTitle) || "section"}-${sectionIndex++}`,
        level: headingLevel,
        title: headingTitle,
        lines: []
      };
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections.filter((section) => normalizeText(section.title) !== "muc luc");
}

function createRulesReader(content) {
  const sections = parseRuleSections(content);
  const wrapper = document.createElement("section");
  wrapper.className = "rules-reader";

  const search = document.createElement("input");
  search.type = "search";
  search.className = "rules-search";
  search.placeholder = "Search rules by keyword...";
  search.setAttribute("aria-label", "Search rules");

  const toc = document.createElement("nav");
  toc.className = "rules-toc";

  const tocTitle = document.createElement("h2");
  tocTitle.className = "rules-toc-title";
  tocTitle.textContent = "Table of Contents";

  const tocList = document.createElement("div");
  tocList.className = "rules-toc-list";

  const docBlock = document.createElement("section");
  docBlock.className = "doc-block";

  const docContent = document.createElement("div");
  docContent.className = "rules-sections";

  const emptyState = document.createElement("p");
  emptyState.className = "rules-empty is-hidden";
  emptyState.textContent = "No matching sections found.";

  const records = sections.map((section) => {
    const tocButton = document.createElement("button");
    tocButton.type = "button";
    tocButton.className = "toc-link";
    tocButton.textContent = section.title;
    tocButton.style.paddingLeft = `${Math.max(0, section.level - 1) * 10 + 10}px`;

    const sectionEl = document.createElement("article");
    sectionEl.className = "rules-section";
    sectionEl.id = section.id;

    const headingTag = section.level <= 2 ? "h3" : "h4";
    const headingEl = document.createElement(headingTag);
    headingEl.className = "rules-section-title";
    headingEl.textContent = section.title;

    const bodyEl = document.createElement("pre");
    bodyEl.className = "doc-content";
    bodyEl.textContent = section.lines.join("\n").trim();

    sectionEl.append(headingEl, bodyEl);

    tocButton.addEventListener("click", () => {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return {
      searchText: normalizeText(`${section.title}\n${section.lines.join("\n")}`),
      tocButton,
      sectionEl
    };
  });

  for (const record of records) {
    tocList.appendChild(record.tocButton);
    docContent.appendChild(record.sectionEl);
  }

  function applyFilter() {
    const query = normalizeText(search.value.trim());
    let visibleCount = 0;

    for (const record of records) {
      const visible = query.length === 0 || record.searchText.includes(query);
      record.tocButton.classList.toggle("is-hidden", !visible);
      record.sectionEl.classList.toggle("is-hidden", !visible);
      if (visible) {
        visibleCount += 1;
      }
    }

    emptyState.classList.toggle("is-hidden", visibleCount > 0);
  }

  search.addEventListener("input", applyFilter);

  toc.append(tocTitle, tocList);
  docBlock.append(docContent);
  wrapper.append(search, toc, docBlock, emptyState);
  return wrapper;
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
  card.classList.add("rules-page");

  const title = document.createElement("h1");
  title.className = "screen-title rules-title";
  title.textContent = "Rules";
  card.append(title, createRulesReader(rulesContent), createBackButton(onBack));
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
