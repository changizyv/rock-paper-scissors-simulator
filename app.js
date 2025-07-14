const container = document.getElementById("game-wrapper");
const countDisplay = {
  rock: document.getElementById("rock-count"),
  paper: document.getElementById("paper-count"),
  scissors: document.getElementById("scissors-count")
};
const startBtn = document.getElementById("start-btn");
const guessSelect = document.getElementById("guess-select");
const elementInput = document.getElementById("element-count");
const timerDisplay = document.getElementById("timer");
const confirmBtn = document.getElementById("reset-btn");
const fastModeBtn = document.getElementById("fast-mode");

let elements = [];
let animationId = null;
let running = false;
let timer = 0;
let interval;
let speedMultiplier = 1;
let userGuess = '';
let gameEnded = false;

// FontAwesome icons
const ICONS = {
  rock: "fa-hand-rock",
  paper: "fa-hand-paper",
  scissors: "fa-hand-scissors"
};

// برنده نسبت به دیگری
const WIN_RULES = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper"
};

// ایجاد عناصر اولیه
function createElements(type, count) {
  const newElements = [];
  const width = container.offsetWidth;
  const height = container.offsetHeight; 

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = `element ${type}`;
    el.innerHTML = `<i class="fas ${ICONS[type]}"></i>`;
    container.appendChild(el);

    const x = Math.random() * (width - 40);
    const y = Math.random() * (height - 40);
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;

    newElements.push({ el, type, x, y, dx, dy });
  }
  return newElements;
}

// بروزرسانی موقعیت
function updatePositions() {
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  elements.forEach(obj => {
    obj.x += obj.dx * speedMultiplier;
    obj.y += obj.dy * speedMultiplier;

    if (obj.x <= 0 || obj.x >= width - 40) obj.dx *= -1;
    if (obj.y <= 0 || obj.y >= height - 40) obj.dy *= -1;

    obj.el.style.transform = `translate(${obj.x}px, ${obj.y}px)`;
  });
}

// بررسی برخورد و تبدیل
function checkCollisions() {
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const a = elements[i];
      const b = elements[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 40) {
        if (WIN_RULES[a.type] === b.type) {
          b.type = a.type;
          b.el.className = `element ${a.type}`;
          b.el.innerHTML = `<i class="fas ${ICONS[a.type]}"></i>`;
          playSound();
        } else if (WIN_RULES[b.type] === a.type) {
          a.type = b.type;
          a.el.className = `element ${b.type}`;
          a.el.innerHTML = `<i class="fas ${ICONS[b.type]}"></i>`;
          playSound();
        }
      }
    }
  }
}

// شمارش عناصر
function updateCounts() {
  const counts = { rock: 0, paper: 0, scissors: 0 };
  elements.forEach(e => counts[e.type]++);
  countDisplay.rock.textContent = counts.rock;
  countDisplay.paper.textContent = counts.paper;
  countDisplay.scissors.textContent = counts.scissors;

  const nonZero = Object.entries(counts).filter(([_, v]) => v > 0);
  if (nonZero.length === 1 && !gameEnded) {
    endGame(nonZero[0][0]);
  }

  updateChartData();
}

// پایان بازی
function endGame(winnerType) {
  gameEnded = true;
  running = false;
  clearInterval(interval);
  cancelAnimationFrame(animationId);
  showFireworks();

  const resultText = document.getElementById("winner-info");
  const userStatus = document.getElementById("user-status");

  resultText.innerHTML = `برنده: ${winnerType} در مدت زمان ${formatTime(timer)}`;
  userStatus.textContent =
    winnerType === userGuess ? "🎉 شما برنده شدید!" : "😢 شما باختید.";

  const soundPath = winnerType === userGuess ? "assets/win.mp3" : "assets/lose.mp3";
  const endSound = new Audio(soundPath);
  endSound.play();

  document.querySelector(".result-modal").classList.add("active");
}

// تایمر
function startTimer() {
  timer = 0;
  timerDisplay.textContent = formatTime(timer);
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = formatTime(timer);
  }, 1000);
}

// تبدیل زمان به فرمت mm:ss
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// صدای برخورد
function playSound() {
  const ding = new Audio("ding.mp3");
  ding.play();
}

// ریست
function resetGame() {
  elements.forEach(e => e.el.remove());
  elements = [];
  cancelAnimationFrame(animationId);
  clearInterval(interval);
  timer = 0;
  timerDisplay.textContent = formatTime(0);
  gameEnded = false;
  document.querySelector(".result-modal").classList.remove("active");
}

// حلقه اصلی بازی
function gameLoop() {
  if (running) {
    updatePositions();
    checkCollisions();
    updateCounts();
  }
  animationId = requestAnimationFrame(gameLoop);
}

// شروع بازی
startBtn.addEventListener("click", () => {
  resetGame();
  const count = parseInt(elementInput.value);
  userGuess = guessSelect.value;

  elements = [
    ...createElements("rock", count),
    ...createElements("paper", count),
    ...createElements("scissors", count)
  ];

  running = true;
  startTimer();
  setTimeout(() => {
    gameLoop();
  }, 0);
});

// تایید پایان
confirmBtn.addEventListener("click", () => {
  resetGame();
});

// کنترل سرعت سریع/کند با نگه‌داشتن
fastModeBtn.addEventListener("mousedown", () => {
  speedMultiplier = 5;
});
fastModeBtn.addEventListener("mouseup", () => {
  speedMultiplier = 1;
});
fastModeBtn.addEventListener("mouseleave", () => {
  speedMultiplier = 1;
});
