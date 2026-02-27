// ----------------------------
// 1) Define problems (v1)
// ----------------------------
const problems = [
  { q: "6 × (4 + 3)", a: 42 },
  { q: "20 ÷ 5 + 8", a: 12 },
  { q: "9 + 6 × 2", a: 21 },
  { q: "(18 − 6) ÷ 3", a: 4 },
  { q: "4 × 5 − 6", a: 14 },
  { q: "36 ÷ (3 + 3)", a: 6 },
  { q: "7 × 3 + 5", a: 26 },
  { q: "8 + 4 × 2", a: 16 },
  { q: "(12 − 4) × 2", a: 16 },
  { q: "25 ÷ 5 + 7", a: 12 },
];

// ----------------------------
// 2) Mystery picture pattern
//    10x10: each tile has a target "color"
//    Empty string = leave blank (never reveal)
// ----------------------------
// Simple heart-ish shape as a starter.
// You can replace with any pixel art later.
const picture = [
  ["", "", "R","R","", "", "R","R","", ""],
  ["", "R","R","R","R","R","R","R","R",""],
  ["R","R","R","R","R","R","R","R","R","R"],
  ["R","R","R","R","R","R","R","R","R","R"],
  ["", "R","R","R","R","R","R","R","R",""],
  ["", "", "R","R","R","R","R","R","", ""],
  ["", "", "", "R","R","R","R","", "", ""],
  ["", "", "", "", "R","R","", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", ""],
];

// map symbols to actual colors
const colorMap = {
  "R": "#ef4444",
};

// ----------------------------
// 3) Game state
// ----------------------------
let order = [];          // randomized indices of problems
let currentIndex = 0;    // which problem the student is on
let revealedCount = 0;   // how many picture tiles are revealed
let revealTargets = [];  // list of revealable cells

// ----------------------------
// 4) Helpers
// ----------------------------
const el = (id) => document.getElementById(id);

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initGrid() {
  const grid = el("grid");
  grid.innerHTML = "";

  revealTargets = [];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const sym = picture[r][c];
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${r}-${c}`;

      if (sym) {
        cell.style.setProperty("--color", colorMap[sym] || "#111827");
        revealTargets.push({ r, c });
      } else {
        // keep these as permanent background
        cell.style.background = "#f3f4f6";
      }

      grid.appendChild(cell);
    }
  }
}

function startGame() {
  // randomize problems
  order = shuffle([...Array(problems.length).keys()]);
  currentIndex = 0;
  revealedCount = 0;

  // reset grid
  initGrid();
  // hide win screen
  el("winScreen").classList.add("hidden");

  // update totals
  el("totalText").textContent = Math.min(problems.length, revealTargets.length);
  el("progressText").textContent = "0";

  loadProblem();
  el("feedback").textContent = "";
  el("answerInput").value = "";
  el("answerInput").focus();
}

function loadProblem() {
  const problem = problems[order[currentIndex]];
  el("problemText").textContent = problem.q;
}

function revealNextTile() {
  if (revealedCount >= revealTargets.length) return;

  const { r, c } = revealTargets[revealedCount];
  el(`cell-${r}-${c}`).classList.add("revealed");
  revealedCount++;

  el("progressText").textContent = String(revealedCount);

  // win condition: either all problems done OR all picture tiles revealed
  if (revealedCount >= Math.min(problems.length, revealTargets.length)) {
    el("winScreen").classList.remove("hidden");
  }
}

function checkAnswer() {
  const raw = el("answerInput").value.trim();
  if (raw === "") return;

  const studentAnswer = Number(raw);
  const correct = problems[order[currentIndex]].a;

  if (studentAnswer === correct) {
    el("feedback").textContent = "✅ Correct!";
    el("feedback").style.color = "#16a34a";

    revealNextTile();

    currentIndex++;
    el("answerInput").value = "";

    if (currentIndex < problems.length && revealedCount < revealTargets.length) {
      loadProblem();
      el("answerInput").focus();
    } else {
      // either out of problems or picture done
      el("winScreen").classList.remove("hidden");
    }
  } else {
    el("feedback").textContent = "❌ Try again.";
    el("feedback").style.color = "#dc2626";
    el("answerInput").focus();
    el("answerInput").select();
  }
}

// ----------------------------
// 5) Wire up events
// ----------------------------
window.addEventListener("DOMContentLoaded", () => {
  el("submitBtn").addEventListener("click", checkAnswer);
  el("answerInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });
  el("playAgainBtn").addEventListener("click", startGame);

  startGame();
});
