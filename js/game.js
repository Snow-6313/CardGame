"use strict";

// Game settings
const DIFFICULTIES = Object.freeze({
  easy: { label: "Easy", pairs: 3, columns: 3, mobileColumns: 3, multiplier: 1 },
  medium: { label: "Medium", pairs: 6, columns: 4, mobileColumns: 4, multiplier: 1.5 },
  hard: { label: "Hard", pairs: 15, columns: 6, mobileColumns: 5, multiplier: 2 },
  "ultra-hard": { label: "Ultra Hard", pairs: 18, columns: 6, mobileColumns: 5, multiplier: 4 },
});
const SCORING = Object.freeze({ pointsPerPair: 100, extraMovePenalty: 12, secondPenalty: 1, minimumPerPair: 25 });
const TIMING = Object.freeze({ mismatchHold: 850, matchHold: 180, completionHold: 350 });
const STORAGE_KEYS = Object.freeze({ theme: "match.theme.v1", difficulty: "match.difficulty.v1", leaderboard: "match.leaderboard.v1", player: "match.player.v1", cameraLock: "match.camera.v1" });

// Put your card image files in the images folder and add them here.
// Example: { id: "card-01", src: "images/my-card.png", label: "Pumpkin" }
const CARD_IMAGES = [
  { id: "card-01", src: "", label: "" },
  { id: "card-02", src: "", label: "" },
  { id: "card-03", src: "", label: "" },
  { id: "card-04", src: "", label: "" },
  { id: "card-05", src: "", label: "" },
  { id: "card-06", src: "", label: "" },
  { id: "card-07", src: "", label: "" },
  { id: "card-08", src: "", label: "" },
  { id: "card-09", src: "", label: "" },
  { id: "card-10", src: "", label: "" },
  { id: "card-11", src: "", label: "" },
  { id: "card-12", src: "", label: "" },
  { id: "card-13", src: "", label: "" },
  { id: "card-14", src: "", label: "" },
  { id: "card-15", src: "", label: "" },
  { id: "card-16", src: "", label: "" },
  { id: "card-17", src: "", label: "" },
  { id: "card-18", src: "", label: "" },
];

// Leaderboard config for devs; keep it separate from the player UI.
const LEADERBOARD_CONFIG = Object.freeze({
  filters: ["all", "easy", "medium", "hard"],
  sorts: [{ value: "score", label: "Score" }, { value: "time", label: "Time" }, { value: "moves", label: "Moves" }],
  defaultFilter: "all",
  defaultSort: "score",
  maxEntries: 100,
  visibleEntries: 20,
  maxNameLength: 24,
});

// Theme data. Add a new entry here and the selector updates automatically.
const THEMES = {
  halloween: {
    label: "Halloween", edition: "The Halloween edition", backSymbol: "✧", scheme: "dark",
    colors: {
      bg: "#120f13", surface: "#1a171d", "surface-soft": "#221d25", text: "#f4efe8", muted: "#b6ab9e",
      accent: "#d86d38", "accent-hover": "#ed8348", "accent-soft": "#3a231d", "on-accent": "#fef7ef",
      border: "#3d343a", "card-back": "#261e25", "card-ink": "#f0d9a8", "card-border": "#604d5a",
      match: "#5b8d67", "match-soft": "#1d2b22", error: "#d16356",
    },
    cards: [["🎃", "Pumpkin"], ["👻", "Ghost"], ["🦇", "Bat"], ["🐈‍⬛", "Black cat"], ["🕷️", "Spider"], ["🕸️", "Spider web"], ["🍬", "Candy"], ["🕯️", "Candle"], ["🌙", "Moon"], ["🧹", "Broom"], ["🧙", "Witch"], ["🍄", "Mushroom"], ["🦉", "Owl"], ["🍂", "Autumn leaves"], ["🍎", "Apple"], ["🔮", "Crystal ball"], ["🗝️", "Old key"], ["🏚️", "Haunted house"]],
  },
  christmas: {
    label: "Christmas", edition: "The merry little edition", backSymbol: "❄", scheme: "light",
    colors: {
      bg: "#f5f6f1", surface: "#fffefa", "surface-soft": "#e9eee5", text: "#26372d", muted: "#627065",
      accent: "#a6383d", "accent-hover": "#852b30", "accent-soft": "#f7e5e4", "on-accent": "#ffffff",
      border: "#d9dfd4", "card-back": "#2e493c", "card-ink": "#e4d4ac", "card-border": "#617665",
      match: "#3d6951", "match-soft": "#eaf2e7", error: "#a6383d",
    },
    cards: [["🎄", "Christmas tree"], ["🎁", "Gift"], ["⛄", "Snowman"], ["🦌", "Reindeer"], ["🔔", "Bell"], ["⭐", "Star"], ["🧦", "Stocking"], ["🍪", "Cookie"], ["🕯️", "Candle"], ["🛷", "Sled"], ["🎅", "Santa"], ["❄️", "Snowflake"], ["🧤", "Mittens"], ["☕", "Hot chocolate"], ["🏠", "Cozy home"], ["🎀", "Ribbon"], ["🍊", "Orange"], ["🧣", "Scarf"]],
  },
  space: {
    label: "Space", edition: "The after-hours edition", backSymbol: "✦", scheme: "dark",
    colors: {
      bg: "#191e2b", surface: "#232a3a", "surface-soft": "#2b3346", text: "#f0f0f7", muted: "#adb5cc",
      accent: "#c0adf5", "accent-hover": "#d1c2ff", "accent-soft": "#39314f", "on-accent": "#211a34",
      border: "#414a60", "card-back": "#2b3249", "card-ink": "#c5b4e9", "card-border": "#56617d",
      match: "#9dceb5", "match-soft": "#253e39", error: "#f0aa99",
    },
    cards: [["🚀", "Rocket"], ["🪐", "Saturn"], ["🌍", "Earth"], ["🌙", "Moon"], ["☀️", "Sun"], ["⭐", "Star"], ["☄️", "Comet"], ["🛸", "Flying saucer"], ["👽", "Alien"], ["🧑‍🚀", "Astronaut"], ["🛰️", "Satellite"], ["🔭", "Telescope"], ["🌌", "Galaxy"], ["🌑", "New moon"], ["💎", "Space crystal"], ["🤖", "Robot"], ["⚡", "Lightning"], ["🧭", "Compass"]],
  },
  ocean: {
    label: "Ocean", edition: "The deep-blue edition", backSymbol: "≋", scheme: "light",
    colors: {
      bg: "#f0f6f6", surface: "#fcffff", "surface-soft": "#e2eeed", text: "#253d42", muted: "#596f73",
      accent: "#236e80", "accent-hover": "#195666", "accent-soft": "#deedf1", "on-accent": "#ffffff",
      border: "#cddede", "card-back": "#254954", "card-ink": "#b9dedf", "card-border": "#527782",
      match: "#356e61", "match-soft": "#e5f1eb", error: "#a64c45",
    },
    cards: [["🐙", "Octopus"], ["🐬", "Dolphin"], ["🐳", "Whale"], ["🦈", "Shark"], ["🐠", "Tropical fish"], ["🐡", "Pufferfish"], ["🦀", "Crab"], ["🦞", "Lobster"], ["🦐", "Shrimp"], ["🪼", "Jellyfish"], ["🐚", "Seashell"], ["🪸", "Coral"], ["🐢", "Sea turtle"], ["⚓", "Anchor"], ["⛵", "Sailboat"], ["🌊", "Wave"], ["🏝️", "Island"], ["🦭", "Seal"]],
  },
  arcade: {
    label: "Arcade", edition: "The one-more-round edition", backSymbol: "+", scheme: "dark",
    colors: {
      bg: "#211d29", surface: "#2c2636", "surface-soft": "#352d40", text: "#f6eef8", muted: "#c0afc9",
      accent: "#edaccc", "accent-hover": "#f9c5df", "accent-soft": "#4a3044", "on-accent": "#311d2e",
      border: "#55445f", "card-back": "#342940", "card-ink": "#e8b8d9", "card-border": "#755781",
      match: "#addbaa", "match-soft": "#304132", error: "#ffb39c",
    },
    cards: [["👾", "Space invader"], ["🕹️", "Joystick"], ["🎮", "Controller"], ["🎲", "Die"], ["🎯", "Target"], ["🏆", "Trophy"], ["💎", "Gem"], ["⚡", "Power up"], ["🍒", "Cherries"], ["🍋", "Lemon"], ["⭐", "Bonus star"], ["🚗", "Race car"], ["🚀", "Rocket"], ["🤖", "Robot"], ["🎳", "Bowling"], ["🎱", "Eight ball"], ["🎪", "Circus"], ["🧩", "Puzzle piece"]],
  },
  nature: {
    label: "Nature", edition: "The slow-down edition", backSymbol: "❋", scheme: "light",
    colors: {
      bg: "#f3f5ed", surface: "#fdfff8", "surface-soft": "#e7ebdd", text: "#303a29", muted: "#647059",
      accent: "#4f7040", "accent-hover": "#3c5830", "accent-soft": "#e4ecdb", "on-accent": "#ffffff",
      border: "#d5ddc9", "card-back": "#364b36", "card-ink": "#d2dfbc", "card-border": "#657b5b",
      match: "#4c7038", "match-soft": "#e7f0dc", error: "#a04a37",
    },
    cards: [["🌻", "Sunflower"], ["🌿", "Herb"], ["🌵", "Cactus"], ["🌲", "Pine tree"], ["🍄", "Mushroom"], ["🦋", "Butterfly"], ["🐝", "Bee"], ["🐞", "Ladybug"], ["🐌", "Snail"], ["🦊", "Fox"], ["🐸", "Frog"], ["🦉", "Owl"], ["🌸", "Cherry blossom"], ["🍓", "Strawberry"], ["🌈", "Rainbow"], ["🍁", "Maple leaf"], ["🐿️", "Squirrel"], ["🌷", "Tulip"]],
  },
};

const { createDeck, calculateScore, formatTime, normalizeName, validateResults, sortResults } = MemoryGameCore;
const $ = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const pendingTimeouts = new Set();
const failedImages = new Set();
const memoryStorage = new Map();
let storageUnavailable = false;
let clockInterval = null;
let activeTheme = "halloween";
let leaderboardFilter = LEADERBOARD_CONFIG.defaultFilter;
let leaderboardSort = LEADERBOARD_CONFIG.defaultSort;
let cameraLockOn = false;
let hardTapCount = 0;
let lastHardTapTime = 0;
let hardTapResetTimer = null;

// One game state object controls every turn.
const state = {
  generation: 0, phase: "ready", difficulty: "easy", deck: [], selected: [],
  matchedIds: new Set(), moves: 0, matches: 0, startedAt: null, seconds: 0,
  result: null, resultSaved: false,
};

// Local storage fallback for blocked or full browser storage.
function showStorageNotice() {
  $("storage-notice").hidden = false;
  $("storage-notice").textContent = "Browser storage is unavailable. You can still play; settings and scores will only last for this visit.";
}

function readStorage(key) {
  if (storageUnavailable) return memoryStorage.get(key) ?? null;
  try {
    const value = localStorage.getItem(key);
    if (value !== null) memoryStorage.set(key, value);
    return value;
  } catch {
    storageUnavailable = true;
    showStorageNotice();
    return memoryStorage.get(key) ?? null;
  }
}

function writeStorage(key, value) {
  memoryStorage.set(key, value);
  if (storageUnavailable) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    storageUnavailable = true;
    showStorageNotice();
    return false;
  }
}

function loadLeaderboard() {
  try {
    return validateResults(JSON.parse(readStorage(STORAGE_KEYS.leaderboard) || "[]"), DIFFICULTIES, LEADERBOARD_CONFIG.maxEntries);
  } catch {
    return [];
  }
}

function updateCameraLockButton() {
  const button = $("camera-lock-toggle");
  const game = document.querySelector(".game");
  document.body.classList.toggle("camera-lock-enabled", cameraLockOn);
  button.classList.toggle("is-on", cameraLockOn);
  button.setAttribute("aria-pressed", String(cameraLockOn));
  button.textContent = cameraLockOn ? "Camera lock: On" : "Camera lock: Off";
  game.classList.toggle("camera-locked", cameraLockOn);
  if (cameraLockOn) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
}

function toggleCameraLock() {
  cameraLockOn = !cameraLockOn;
  updateCameraLockButton();
  writeStorage(STORAGE_KEYS.cameraLock, String(cameraLockOn));
}

// Theme logic keeps the board state intact.
function saveTheme(themeId) {
  writeStorage(STORAGE_KEYS.theme, themeId);
}

function applyTheme(themeId, persist = true) {
  activeTheme = Object.hasOwn(THEMES, themeId) ? themeId : "halloween";
  const theme = THEMES[activeTheme];
  const colors = { ...THEMES.halloween.colors, ...theme.colors };
  for (const [token, value] of Object.entries(colors)) document.documentElement.style.setProperty(`--${token}`, value);
  document.documentElement.dataset.theme = activeTheme;
  document.documentElement.style.colorScheme = theme.scheme;
  document.querySelector('meta[name="theme-color"]').content = colors.bg;
  $("theme-select").value = activeTheme;
  $("theme-edition").textContent = theme.edition.toUpperCase();
  state.deck.forEach((card, index) => {
    const button = $("game-board").children[index];
    button.querySelector(".card-back-symbol").textContent = theme.backSymbol;
    renderCardArtwork(button.querySelector(".card-art"), card);
    updateCardLabel(button, card, index);
  });
  if (persist) saveTheme(activeTheme);
}

function getPlaceholder(card) {
  return THEMES[activeTheme].cards[card.artIndex] || [String(card.artIndex + 1), `Symbol ${card.artIndex + 1}`];
}

function getCardName(card) {
  return card.src && !failedImages.has(card.src) ? (card.label || `Card image ${card.artIndex + 1}`) : getPlaceholder(card)[1];
}

function renderCardArtwork(container, card) {
  container.replaceChildren();
  if (card.src && !failedImages.has(card.src)) {
    const image = document.createElement("img");
    image.alt = ""; // The card button supplies the accessible name only when revealed.
    image.draggable = false;
    image.addEventListener("error", () => {
      failedImages.add(card.src);
      // Both copies fall back together, even if only one request has failed yet.
      state.deck.forEach((item, index) => {
        if (item.src !== card.src) return;
        const button = $("game-board").children[index];
        renderCardArtwork(button.querySelector(".card-art"), item);
        updateCardLabel(button, item, index);
      });
    }, { once: true });
    image.src = card.src;
    container.append(image);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "card-placeholder";
    placeholder.textContent = getPlaceholder(card)[0];
    container.append(placeholder);
  }
}

// Small helpers for timing and board setup.
function schedule(callback, delay) {
  const generation = state.generation;
  const timeout = setTimeout(() => {
    pendingTimeouts.delete(timeout);
    if (generation === state.generation) callback();
  }, delay);
  pendingTimeouts.add(timeout);
}

function flipDuration() {
  if (reducedMotion.matches) return 0;
  const duration = getComputedStyle(document.documentElement).getPropertyValue("--flip-duration").trim();
  return duration.endsWith("ms") ? parseFloat(duration) : parseFloat(duration) * 1000;
}

function startGame(difficulty = state.difficulty) {
  const nextDifficulty = Object.hasOwn(DIFFICULTIES, difficulty) ? difficulty : "easy";
  const config = DIFFICULTIES[nextDifficulty];
  const deck = createDeck(CARD_IMAGES.map((card, artIndex) => ({ ...card, artIndex })), config.pairs);
  pendingTimeouts.forEach(clearTimeout);
  pendingTimeouts.clear();
  clearInterval(clockInterval);
  clockInterval = null;
  document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
  Object.assign(state, {
    generation: state.generation + 1, phase: "ready", difficulty: nextDifficulty,
    deck, selected: [], matchedIds: new Set(), moves: 0, matches: 0,
    startedAt: null, seconds: 0, result: null, resultSaved: false,
  });
  const board = $("game-board");
  board.dataset.difficulty = nextDifficulty;
  board.style.setProperty("--columns", config.columns);
  board.style.setProperty("--mobile-columns", config.mobileColumns);
  board.setAttribute("aria-label", `${config.label} memory game, ${config.pairs * 2} cards`);
  board.replaceChildren(...state.deck.map(createCard));
  document.querySelectorAll("[data-difficulty-option]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.difficultyOption === nextDifficulty)));
  $("pair-total").textContent = ` / ${config.pairs}`;
  $("board-caption").textContent = `${config.pairs * 2} cards. ${config.pairs} little discoveries.`;
  $("game-status").textContent = "Ready when you are";
  $("board-hint").textContent = "Pick any two cards to find a pair.";
  $("result-open").hidden = true;
  $("save-score").disabled = false;
  $("player-name").disabled = false;
  $("player-name").setCustomValidity("");
  $("save-feedback").textContent = "";
  updateStats();
  announce(`${config.label} game ready. Find ${config.pairs} pairs.`);
  writeStorage(STORAGE_KEYS.difficulty, nextDifficulty);
}

function createCard(card, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";
  button.dataset.index = index;
  // This local-only game is not an anti-cheat system; card data stays inspectable.
  button.dataset.pairId = card.id;
  const inner = document.createElement("span");
  inner.className = "card-inner";
  inner.setAttribute("aria-hidden", "true");
  const back = document.createElement("span");
  back.className = "card-face card-back";
  const symbol = document.createElement("span");
  symbol.className = "card-back-symbol";
  symbol.textContent = THEMES[activeTheme].backSymbol;
  back.append(symbol);
  const front = document.createElement("span");
  front.className = "card-face card-front";
  const artwork = document.createElement("span");
  artwork.className = "card-art";
  renderCardArtwork(artwork, card);
  const tick = document.createElement("span");
  tick.className = "match-tick";
  tick.textContent = "✓";
  front.append(artwork, tick);
  inner.append(back, front);
  button.append(inner);
  updateCardLabel(button, card, index);
  return button;
}

function updateCardLabel(button, card, index) {
  const matched = state.matchedIds.has(card.id);
  const revealed = matched || state.selected.includes(index);
  button.setAttribute("aria-label", `Card ${index + 1}, ${revealed ? `${getCardName(card)}, ${matched ? "matched" : "revealed"}` : "face down"}`);
  button.setAttribute("aria-disabled", String(revealed));
  button.tabIndex = matched ? -1 : 0;
}

// Match logic and turn rules.
function flipCard(index) {
  const card = state.deck[index];
  if (!card || state.phase !== "ready" || state.selected.includes(index) || state.matchedIds.has(card.id)) return;
  if (state.startedAt === null) {
    state.startedAt = performance.now();
    clockInterval = setInterval(updateStats, 250);
    $("game-status").textContent = "A little focus goes a long way";
  }
  state.phase = "flipping";
  state.selected.push(index);
  const button = $("game-board").children[index];
  button.classList.add("is-flipped");
  updateCardLabel(button, card, index);
  announce(`${getCardName(card)} revealed. ${state.selected.length === 1 ? "Choose another card." : "Checking pair."}`);
  if (state.selected.length === 2) state.moves += 1;
  updateStats();
  schedule(() => {
    if (state.selected.length === 2) checkMatch();
    else state.phase = "ready";
  }, flipDuration());
}

function checkMatch() {
  state.phase = "evaluating";
  const [first, second] = state.selected.map((index) => state.deck[index]);
  if (first.id === second.id) handleMatch();
  else handleMismatch();
}

function handleMatch() {
  const first = state.deck[state.selected[0]];
  state.matchedIds.add(first.id);
  state.matches += 1;
  state.selected.forEach((index) => {
    const button = $("game-board").children[index];
    button.classList.add("is-matched");
    updateCardLabel(button, state.deck[index], index);
  });
  const pairs = DIFFICULTIES[state.difficulty].pairs;
  announce(`${getCardName(first)} matched. ${state.matches} of ${pairs} pairs found.`);
  $("board-hint").textContent = state.matches === pairs ? "Every card has found its other half." : "A perfect pair. Keep going.";
  state.selected = [];
  updateStats();
  if (state.matches === pairs) endGame();
  else schedule(() => { state.phase = "ready"; }, reducedMotion.matches ? 0 : TIMING.matchHold);
}

function handleMismatch() {
  const indices = [...state.selected];
  indices.forEach((index) => $("game-board").children[index].classList.add("is-mismatched"));
  announce(`Not a match: ${indices.map((index) => getCardName(state.deck[index])).join(" and ")}. Try another pair.`);
  $("board-hint").textContent = "Not quite. A little something to remember.";
  schedule(() => {
    state.phase = "resetting";
    state.selected = [];
    indices.forEach((index) => {
      const button = $("game-board").children[index];
      button.classList.remove("is-flipped", "is-mismatched");
      updateCardLabel(button, state.deck[index], index);
    });
    schedule(() => { state.phase = "ready"; }, flipDuration());
  }, TIMING.mismatchHold);
}

function currentScore() {
  return calculateScore(state.matches, state.moves, state.seconds, DIFFICULTIES[state.difficulty].multiplier, SCORING);
}

function updateStats() {
  if (state.startedAt !== null && state.phase !== "complete") state.seconds = Math.floor((performance.now() - state.startedAt) / 1000);
  $("moves").textContent = state.moves;
  $("timer").textContent = formatTime(state.seconds);
  $("score").textContent = currentScore().toLocaleString();
  $("matched").textContent = state.matches;
}

function announce(message) {
  $("announcer").textContent = message;
}

// Finish the round and save the result.
function endGame() {
  updateStats();
  state.phase = "complete";
  clearInterval(clockInterval);
  clockInterval = null;
  state.result = Object.freeze({
    id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    difficulty: state.difficulty, score: currentScore(), moves: state.moves,
    seconds: state.seconds, date: new Date().toISOString(),
  });
  $("game-status").textContent = "Beautifully done";
  $("result-open").hidden = false;
  $("completion-description").textContent = `You found all ${state.matches} pairs on ${DIFFICULTIES[state.difficulty].label.toLowerCase()}. That's a moment well spent.`;
  $("final-score").textContent = state.result.score.toLocaleString();
  $("final-moves").textContent = state.result.moves;
  $("final-time").textContent = formatTime(state.result.seconds);
  $("player-name").value = normalizeName(readStorage(STORAGE_KEYS.player), LEADERBOARD_CONFIG.maxNameLength);
  announce(`All pairs matched! ${state.result.score} points in ${state.moves} moves and ${formatTime(state.seconds)}. Save your result or play again.`);
  schedule(() => {
    // A result may arrive while the instructions/leaderboard is open.
    document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
    openDialog($("completion-dialog"));
    $("player-name").focus();
  }, reducedMotion.matches ? 0 : TIMING.completionHold);
}

function saveScore(event) {
  event.preventDefault();
  if (!state.result || state.resultSaved) return;
  const name = normalizeName($("player-name").value, LEADERBOARD_CONFIG.maxNameLength);
  if (!name) {
    $("player-name").setCustomValidity("Please enter a name, not just spaces.");
    $("player-name").reportValidity();
    return;
  }
  const entries = loadLeaderboard().filter((entry) => entry.id !== state.result.id);
  entries.push({ ...state.result, name });
  // Keep personal bests rather than the latest 100 attempts.
  const ranked = sortResults(entries, "score").slice(0, LEADERBOARD_CONFIG.maxEntries);
  const persisted = writeStorage(STORAGE_KEYS.leaderboard, JSON.stringify(ranked));
  writeStorage(STORAGE_KEYS.player, name);
  state.resultSaved = true;
  $("save-score").disabled = true;
  $("player-name").disabled = true;
  const retained = ranked.some((entry) => entry.id === state.result.id);
  $("save-feedback").textContent = !retained ? `Nice game, ${name}. Only your top ${LEADERBOARD_CONFIG.maxEntries} results are kept.`
    : persisted ? `Saved, ${name}. See you on the leaderboard.` : `Saved for this visit, ${name}. Browser storage is unavailable.`;
  renderLeaderboard();
}

// Leaderboard rendering.
function renderLeaderboard() {
  const results = sortResults(loadLeaderboard().filter((entry) => leaderboardFilter === "all" || entry.difficulty === leaderboardFilter), leaderboardSort)
    .slice(0, LEADERBOARD_CONFIG.visibleEntries);
  $("leaderboard-body").replaceChildren(...results.map((entry, index) => {
    const row = document.createElement("tr");
    row.title = `Played ${new Date(entry.date).toLocaleDateString()}`;
    const values = [index + 1, entry.name, DIFFICULTIES[entry.difficulty].label, entry.score.toLocaleString(), entry.moves, formatTime(entry.seconds)];
    values.forEach((value, column) => {
      const cell = document.createElement("td");
      if (column === 2) {
        const badge = document.createElement("span");
        badge.className = "difficulty-badge";
        badge.textContent = value;
        cell.append(badge);
      } else cell.textContent = value;
      row.append(cell);
    });
    return row;
  }));
  $("leaderboard-empty").hidden = results.length > 0;
  $("leaderboard-dialog").querySelector(".table-scroll").hidden = results.length === 0;
  document.querySelectorAll("[data-leaderboard-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.leaderboardFilter === leaderboardFilter)));
  $("leaderboard-sort").value = leaderboardSort;
}

function clearLeaderboard() {
  writeStorage(STORAGE_KEYS.leaderboard, JSON.stringify([]));
  renderLeaderboard();
}

function resetHardTapState() {
  hardTapCount = 0;
  lastHardTapTime = 0;
  if (hardTapResetTimer) {
    clearTimeout(hardTapResetTimer);
    hardTapResetTimer = null;
  }
}

function handleHardButtonClick() {
  const now = Date.now();
  if (state.difficulty === "ultra-hard") {
    resetHardTapState();
    startGame("hard");
    return;
  }

  if (state.difficulty !== "hard") {
    resetHardTapState();
    startGame("hard");
    return;
  }

  if (hardTapResetTimer) clearTimeout(hardTapResetTimer);

  if (now - lastHardTapTime <= 700) {
    hardTapCount += 1;
  } else {
    hardTapCount = 1;
  }

  lastHardTapTime = now;
  hardTapResetTimer = setTimeout(() => {
    resetHardTapState();
  }, 900);

  if (hardTapCount >= 5) {
    resetHardTapState();
    startGame("ultra-hard");
    return;
  }

  startGame("hard");
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

// Setup UI and event listeners.
function initialize() {
  for (const [id, theme] of Object.entries(THEMES)) $("theme-select").add(new Option(theme.label, id));
  for (const [id, config] of Object.entries(DIFFICULTIES)) {
    if (id === "ultra-hard") continue;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = config.label;
    button.dataset.difficultyOption = id;
    button.addEventListener("click", () => {
      if (id === "hard") {
        handleHardButtonClick();
        return;
      }
      resetHardTapState();
      if (state.difficulty !== id) startGame(id);
    });
    $("difficulty-options").append(button);
  }
  for (const filter of LEADERBOARD_CONFIG.filters) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = filter === "all" ? "All" : DIFFICULTIES[filter].label;
    button.dataset.leaderboardFilter = filter;
    button.addEventListener("click", () => { leaderboardFilter = filter; renderLeaderboard(); });
    $("leaderboard-filters").append(button);
  }
  LEADERBOARD_CONFIG.sorts.forEach(({ label, value }) => $("leaderboard-sort").add(new Option(label, value)));
  $("player-name").maxLength = LEADERBOARD_CONFIG.maxNameLength;
  $("scoring-explanation").textContent = `${SCORING.pointsPerPair} points per pair, minus ${SCORING.extraMovePenalty} for each move beyond the pair count and ${SCORING.secondPenalty} per elapsed second. Your score never falls below ${SCORING.minimumPerPair} points per found pair. Multiply the total by ${Object.values(DIFFICULTIES).map((level) => `${level.multiplier} for ${level.label}`).join(", ")}, then round to the nearest integer. The live score uses pairs found so far. One move means two cards flipped.`;

  $("game-board").addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (card) flipCard(Number(card.dataset.index));
  });
  $("new-game").addEventListener("click", () => startGame());
  $("camera-lock-toggle").addEventListener("click", toggleCameraLock);
  $("play-again").addEventListener("click", () => { startGame(); $("game-board").querySelector(".card").focus(); });
  $("theme-select").addEventListener("change", (event) => applyTheme(event.target.value));
  $("leaderboard-open").addEventListener("click", () => { renderLeaderboard(); openDialog($("leaderboard-dialog")); });
  $("leaderboard-sort").addEventListener("change", (event) => { leaderboardSort = event.target.value; renderLeaderboard(); });
  $("clear-leaderboard").addEventListener("click", () => {
    if (!confirm("Clear the leaderboard? This removes saved scores from this device.")) return;
    clearLeaderboard();
  });
  $("help-open").addEventListener("click", () => openDialog($("help-dialog")));
  $("result-open").addEventListener("click", () => openDialog($("completion-dialog")));
  $("score-form").addEventListener("submit", saveScore);
  $("player-name").addEventListener("input", () => $("player-name").setCustomValidity(""));
  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  // Native dialogs contain focus and restore it on close. Handle Escape explicitly
  // as well, for embedded browsers that do not dispatch native close requests.
  document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  }));
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.leaderboard && $("leaderboard-dialog").open) renderLeaderboard();
    if (event.key === STORAGE_KEYS.theme) applyTheme(event.newValue, false);
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) updateStats(); });
  // Warm the fallback cache before any write can encounter a quota error.
  loadLeaderboard();
  readStorage(STORAGE_KEYS.player);
  const savedTheme = readStorage(STORAGE_KEYS.theme);
  const savedDifficulty = readStorage(STORAGE_KEYS.difficulty);
  cameraLockOn = readStorage(STORAGE_KEYS.cameraLock) === "true";
  applyTheme(savedTheme, false);
  updateCameraLockButton();
  startGame(savedDifficulty);
}

initialize();