import rulesContent from "../../../rules.md?raw";
import { marked } from "marked";

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

function buildSectionTree(sections) {
  const root = {
    level: 0,
    numberParts: [],
    children: []
  };
  const stack = [root];

  for (const section of sections) {
    while (stack.length > 1 && section.level <= stack[stack.length - 1].level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    const numberParts = [...parent.numberParts, parent.children.length + 1];
    const node = {
      section,
      level: section.level,
      numberParts,
      children: [],
      parent,
      expanded: false
    };

    parent.children.push(node);
    stack.push(node);
  }

  return root.children;
}

function createRulesReader(content) {
  marked.setOptions({
    gfm: true,
    breaks: true
  });

  const sections = parseRuleSections(content);
  const sectionTree = buildSectionTree(sections);
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

  const records = new Map();

  for (const section of sections) {
    const sectionEl = document.createElement("article");
    sectionEl.className = "rules-section";
    sectionEl.id = section.id;

    const headingTag = section.level <= 2 ? "h3" : "h4";
    const headingEl = document.createElement(headingTag);
    headingEl.className = "rules-section-title";
    headingEl.textContent = section.title;

    const bodyEl = document.createElement("div");
    bodyEl.className = "doc-content";
    bodyEl.innerHTML = marked.parse(section.lines.join("\n").trim());

    sectionEl.append(headingEl, bodyEl);
    docContent.appendChild(sectionEl);
    records.set(section.id, {
      searchText: normalizeText(`${section.title}\n${section.lines.join("\n")}`),
      sectionEl
    });
  }

  function openParentTree(node) {
    let current = node.parent;
    while (current && current.section) {
      current.expanded = true;
      const record = records.get(current.section.id);
      if (record?.toggleBtn) {
        record.toggleBtn.textContent = "-";
      }
      if (record?.childrenWrap) {
        record.childrenWrap.classList.remove("is-hidden");
      }
      current = current.parent;
    }
  }

  function renderTree(nodes, target) {
    for (const node of nodes) {
      const hasChildren = node.children.length > 0;
      const record = records.get(node.section.id);
      const item = document.createElement("div");
      item.className = `toc-item level-${Math.min(node.level, 6)}`;

      const row = document.createElement("div");
      row.className = "toc-row";

      let toggleBtn = null;
      let toggleControl;
      if (hasChildren) {
        toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "toc-toggle";
        toggleBtn.textContent = "+";
        toggleBtn.setAttribute("aria-label", "Toggle children");
        toggleControl = toggleBtn;
      } else {
        const spacer = document.createElement("span");
        spacer.className = "toc-toggle-spacer";
        toggleControl = spacer;
      }

      const number = document.createElement("span");
      number.className = "toc-number";
      number.textContent = `${node.numberParts.join(".")}.`;

      const link = document.createElement("button");
      link.type = "button";
      link.className = "toc-link";
      link.textContent = node.section.title;
      link.setAttribute("aria-label", `Go to ${node.section.title}`);

      const childrenWrap = document.createElement("div");
      childrenWrap.className = "toc-children is-hidden";

      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          node.expanded = !node.expanded;
          toggleBtn.textContent = node.expanded ? "-" : "+";
          childrenWrap.classList.toggle("is-hidden", !node.expanded);
        });
      }

      link.addEventListener("click", () => {
        openParentTree(node);
        record.sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      row.append(toggleControl, number, link);
      item.append(row, childrenWrap);
      target.appendChild(item);

      records.set(node.section.id, {
        ...record,
        tocItem: item,
        toggleBtn,
        childrenWrap
      });

      renderTree(node.children, childrenWrap);
    }
  }

  renderTree(sectionTree, tocList);

  function filterTree(nodes, query) {
    let anyVisible = false;

    for (const node of nodes) {
      const record = records.get(node.section.id);
      const selfMatch = query.length === 0 || record.searchText.includes(query);
      const childMatch = filterTree(node.children, query);
      const visibleInToc = selfMatch || childMatch;
      const visibleInDoc = query.length === 0 || selfMatch;

      record.tocItem.classList.toggle("is-hidden", !visibleInToc);
      record.sectionEl.classList.toggle("is-hidden", !visibleInDoc);

      if (query.length > 0 && childMatch) {
        node.expanded = true;
        record.toggleBtn.textContent = "-";
        record.childrenWrap.classList.remove("is-hidden");
      } else if (query.length === 0 && node.children.length > 0) {
        node.expanded = false;
        record.toggleBtn.textContent = "+";
        record.childrenWrap.classList.add("is-hidden");
      }

      if (visibleInDoc) {
        anyVisible = true;
      }
    }

    return anyVisible;
  }

  function applyFilter() {
    const query = normalizeText(search.value.trim());
    const hasVisibleSections = filterTree(sectionTree, query);
    emptyState.classList.toggle("is-hidden", hasVisibleSections);
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
