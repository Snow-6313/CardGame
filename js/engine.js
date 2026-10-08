(function (root) {
  "use strict";

  function shuffle(items, random = Math.random) {
    const result = [...items];
    // Simple deck shuffle.
    for (let index = result.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }

  function createDeck(cardSet, pairCount, random = Math.random) {
    if (!Number.isInteger(pairCount) || pairCount < 1 || pairCount > cardSet.length) {
      throw new Error("Pair count must be a positive integer within the available card set.");
    }
    if (new Set(cardSet.map((card) => card.id)).size !== cardSet.length) {
      throw new Error("Every card definition must have a unique id.");
    }
    const chosen = shuffle(cardSet, random).slice(0, pairCount);
    return shuffle(chosen.flatMap((card) => [
      { ...card, instanceId: `${card.id}-a` },
      { ...card, instanceId: `${card.id}-b` },
    ]), random);
  }

  function calculateScore(matches, moves, seconds, multiplier, rules) {
    const extraMoves = Math.max(0, moves - matches);
    const points = matches * rules.pointsPerPair;
    const penalties = extraMoves * rules.extraMovePenalty + Math.floor(seconds) * rules.secondPenalty;
    return Math.round(Math.max(matches * rules.minimumPerPair, points - penalties) * multiplier);
  }

  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  }

  function normalizeName(value, maxLength = 24) {
    return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
  }

  function validateResults(value, difficulties, limit) {
    if (!Array.isArray(value)) return [];
    return value.filter((entry) => entry && typeof entry === "object"
      && typeof entry.id === "string" && entry.id.length <= 100
      && typeof entry.name === "string" && normalizeName(entry.name).length > 0
      && Object.hasOwn(difficulties, entry.difficulty)
      && Number.isSafeInteger(entry.score) && entry.score >= 0
      && Number.isSafeInteger(entry.moves) && entry.moves >= difficulties[entry.difficulty].pairs
      && Number.isSafeInteger(entry.seconds) && entry.seconds >= 0
      && typeof entry.date === "string" && Number.isFinite(Date.parse(entry.date)))
      .map((entry) => ({
        id: entry.id, name: normalizeName(entry.name), difficulty: entry.difficulty,
        score: entry.score, moves: entry.moves, seconds: entry.seconds, date: entry.date,
      }))
      .slice(0, limit);
  }

  function sortResults(results, sortBy) {
    return [...results].sort((a, b) => {
      if (sortBy === "time") return a.seconds - b.seconds || b.score - a.score || a.moves - b.moves;
      if (sortBy === "moves") return a.moves - b.moves || b.score - a.score || a.seconds - b.seconds;
      return b.score - a.score || a.moves - b.moves || a.seconds - b.seconds;
    });
  }

  const api = { shuffle, createDeck, calculateScore, formatTime, normalizeName, validateResults, sortResults };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.MemoryGameCore = Object.freeze(api);
})(typeof globalThis !== "undefined" ? globalThis : this);