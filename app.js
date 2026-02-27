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
// 2) Mystery image stages (updated names)
// ----------------------------
const imageStages = [
  "image/1.png",  // Stage 1 (full resolution)
  "image/2.png",  // Stage 2
  "image/3.png",  // Stage 3
  "image/4.png",  // Stage 4
  "image/5.png"   // Stage 5 (most pixelated)
];
// ----------------------------
// 3) Game state
// ----------------------------
let currentIndex = 0;      // which problem the student is on
let revealedStage = 0;     // the current image stage (0–4)

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

function loadProblem() {
  const problem = problems[currentIndex];
  el("problemText").textContent = problem.q;
}

function updateImage() {
  // Update image source based on the stage
  el("image").src = imageStages[revealedStage];
}

function startGame() {
  // randomize problems
  shuffle(problems);
  currentIndex = 0;
  revealedStage = 0;

  // reset the image to the first pixelated stage
  updateImage();

  // reset problem
  loadProblem();
  el("feedback").textContent = "";
  el("answerInput").value = "";
  el("answerInput").focus();

  // update total progress
  el("totalText").textContent = problems.length;
  el("progressText").textContent = "0";
}

function checkAnswer() {
  const raw = el("answerInput").value.trim();
  if (raw === "") return;

  const studentAnswer = Number(raw);
  const correct = problems[currentIndex].a;

  if (studentAnswer === correct) {
    el("feedback").textContent = "✅ Correct!";
    el("feedback").style.color = "#16a34a";

    // Move to the next stage of the image
    revealedStage++;
    if (revealedStage < imageStages.length) {
      updateImage();
    }

    // Move to next problem
    currentIndex++;
    el("answerInput").value = "";

    if (currentIndex < problems.length) {
      loadProblem();
      el("answerInput").focus();
    } else {
      // win condition: all problems done
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
