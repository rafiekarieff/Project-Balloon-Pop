// 🎮 Game State
let gameState = {
  isPlaying: false,
  score: 0,
  balloons: [],
  maxBalloons: 10,
  spawnTimer: 0,
  spawnInterval: 1000,
  lastSpawnTime: 0,
};

// 🎈 Balloon Types
const balloonTypes = [
  { color: 'red', image: 'images/red-balloon.png', popImage: 'images/red-pop.png' },
  { color: 'blue', image: 'images/blue-balloon.png', popImage: 'images/blue-pop.png' },
  { color: 'green', image: 'images/green-balloon.png', popImage: 'images/green-pop.png' },
  { color: 'yellow', image: 'images/yellow-balloon.png', popImage: 'images/yellow-pop.png' },
  { color: 'orange', image: 'images/orange-balloon.png', popImage: 'images/orange-pop.png' },
  { color: 'pink', image: 'images/pink-balloon.png', popImage: 'images/pink-pop.png' },
  { color: 'purple', image: 'images/purple-balloon.png', popImage: 'images/purple-pop.png' },
];

// 🔢 Digit Images
const digitImages = {
  0: 'images/no-0.png',
  1: 'images/no-1.png',
  2: 'images/no-2.png',
  3: 'images/no-3.png',
  4: 'images/no-4.png',
  5: 'images/no-5.png',
  6: 'images/no-6.png',
  7: 'images/no-7.png',
  8: 'images/no-8.png',
  9: 'images/no-9.png',
};

// 🧩 DOM Elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startButton = document.getElementById('startButton');
const backButton = document.getElementById('backButton');
const balloonsContainer = document.getElementById('balloonsContainer');
const popSound = document.getElementById('popSound');
const scoreHundreds = document.getElementById('scoreHundreds');
const scoreTens = document.getElementById('scoreTens');
const scoreOnes = document.getElementById('scoreOnes');
const bgMusic = document.getElementById('bgMusic');

// 🧠 Initialize
function init() {
  console.log("Initializing game...");

  if (startButton) {
    startButton.addEventListener("click", startGame);
    startButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startGame();
    });
  }

  if (backButton) {
    backButton.addEventListener("click", backToMenu);
    backButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      backToMenu();
    });
  }

  updateScoreDisplay();
}

// ▶️ Start Game
function startGame() {
  console.log("Starting game...");
  startScreen.classList.remove("active");
  gameScreen.classList.add("active");

  // Start music
  bgMusic.volume = 0.5;
  bgMusic.currentTime = 0;
  bgMusic.play().catch(err => console.log("Autoplay blocked:", err));

  gameState.isPlaying = true;
  gameState.score = 0;
  gameState.balloons = [];
  gameState.lastSpawnTime = Date.now();
  updateScoreDisplay();
  gameLoop();
}

// ⏹ Back to Menu
function backToMenu() {
  console.log("Returning to menu...");
  gameScreen.classList.remove("active");
  startScreen.classList.add("active");

  gameState.isPlaying = false;

  // Stop background music properly
  if (!bgMusic.paused) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }

  // Clear balloons
  balloonsContainer.innerHTML = "";
  gameState.balloons = [];
}

// 🔁 Game Loop
function gameLoop() {
  if (!gameState.isPlaying) return;

  const currentTime = Date.now();

  if (currentTime - gameState.lastSpawnTime > gameState.spawnInterval &&
      gameState.balloons.length < gameState.maxBalloons) {
    spawnBalloon();
    gameState.lastSpawnTime = currentTime;
    gameState.spawnInterval = 800 + Math.random() * 700;
  }

  updateBalloons();
  removeOffScreenBalloons();
  requestAnimationFrame(gameLoop);
}

// 🎈 Spawn Balloon
function spawnBalloon() {
  const balloonType = balloonTypes[Math.floor(Math.random() * balloonTypes.length)];
  const balloon = document.createElement('div');
  balloon.className = 'balloon';

  const size = 150 + Math.random() * 80;
  const startX = Math.random() * (window.innerWidth - size);
  const speed = 1 + Math.random() * 2;
  const swayAmount = 3 + Math.random() * 5;

  balloon.style.width = size + 'px';
  balloon.style.height = size + 'px';
  balloon.style.left = startX + 'px';
  balloon.style.bottom = '-50px';
  balloon.style.backgroundImage = `url('${balloonType.image}')`;
  balloon.style.backgroundSize = 'contain';
  balloon.style.backgroundRepeat = 'no-repeat';
  balloon.style.backgroundPosition = 'center';
  balloon.style.animation = `balloonFloat ${2 + Math.random() * 2}s ease-in-out infinite`;

  const balloonData = {
    element: balloon,
    type: balloonType,
    speed,
    swayAmount,
    swayDirection: Math.random() > 0.5 ? 1 : -1,
    swaySpeed: 0.02 + Math.random() * 0.03,
    swayPhase: Math.random() * Math.PI * 2,
    startX,
    y: -50
  };

  balloon.addEventListener('click', () => popBalloon(balloonData));
  balloon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    popBalloon(balloonData);
  });

  balloonsContainer.appendChild(balloon);
  gameState.balloons.push(balloonData);
}

// 🪁 Update Balloons
function updateBalloons() {
  gameState.balloons.forEach(balloon => {
    if (balloon.element.classList.contains('popping')) return;
    balloon.y += balloon.speed;
    balloon.element.style.bottom = balloon.y + 'px';
    balloon.swayPhase += balloon.swaySpeed;
    const swayX = Math.sin(balloon.swayPhase) * balloon.swayAmount;
    balloon.element.style.left = (balloon.startX + swayX) + 'px';
  });
}

// 💥 Pop Balloon
function popBalloon(balloonData) {
  if (balloonData.element.classList.contains('popping')) return;

  balloonData.element.classList.add('popping');
  balloonData.element.style.backgroundImage = `url('${balloonData.type.popImage}')`;

  popSound.currentTime = 0;
  popSound.play().catch(() => {});

  gameState.score = Math.min(gameState.score + 1, 999);
  updateScoreDisplay();

  setTimeout(() => {
    if (balloonData.element.parentNode)
      balloonData.element.parentNode.removeChild(balloonData.element);
    const index = gameState.balloons.indexOf(balloonData);
    if (index > -1) gameState.balloons.splice(index, 1);
  }, 300);
}

// 🧹 Remove Off-Screen Balloons
function removeOffScreenBalloons() {
  gameState.balloons = gameState.balloons.filter(balloon => {
    if (balloon.y > window.innerHeight + 100) {
      balloon.element.remove();
      return false;
    }
    return true;
  });
}

// 🔢 Update Score Display
function updateScoreDisplay() {
  const score = gameState.score;
  scoreHundreds.src = digitImages[Math.floor(score / 100)];
  scoreTens.src = digitImages[Math.floor((score % 100) / 10)];
  scoreOnes.src = digitImages[score % 10];
}

// 📏 Resize Adjustments
window.addEventListener('resize', () => {
  gameState.balloons.forEach(balloon => {
    if (balloon.startX > window.innerWidth - 50) {
      balloon.startX = window.innerWidth - 50;
    }
  });
});

// 💤 Pause Game on Tab Inactive
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gameState.isPlaying = false;
  } else if (gameScreen.classList.contains('active')) {
    gameState.isPlaying = true;
    gameLoop();
  }
});

// 🌿 Grass Animation (Wind Sway)
window.addEventListener('load', () => {
  const bgGrass = document.querySelector('.background-grass');
  const fgGrass = document.querySelector('.foreground-grass');
  let t = 0;

  function animateGrass() {
    t += 0.02;
    const bgOffset = Math.sin(t) * 10;
    const fgOffset = Math.sin(t * 1.5) * 10;
    if (bgGrass) bgGrass.style.transform = `translateX(${bgOffset}px)`;
    if (fgGrass) fgGrass.style.transform = `translateX(${fgOffset}px)`;
    requestAnimationFrame(animateGrass);
  }

  animateGrass();
});

// --- FIX: Mobile Audio Unlock ---
function unlockAudio() {
  bgMusic.play().then(() => {
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
  }).catch(() => {});
}

// Attach unlock once
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });


// 🧠 Initialize Game
document.addEventListener("DOMContentLoaded", init);

window.addEventListener('resize', () => {
  document.documentElement.style.height = `${window.innerHeight}px`;
});
// Adjust viewport height dynamically for mobile browsers
function fixViewportHeight() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  document.body.style.height = `${window.innerHeight}px`;
}
window.addEventListener('resize', fixViewportHeight);
window.addEventListener('orientationchange', fixViewportHeight);
fixViewportHeight();
