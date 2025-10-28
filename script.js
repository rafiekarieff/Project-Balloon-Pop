// Game State
let gameState = {
    isPlaying: false,
    score: 0,
    balloons: [],
    maxBalloons: 10,
    spawnTimer: 0,
    spawnInterval: 1000, // milliseconds
    lastSpawnTime: 0
};

// Balloon types and their properties
const balloonTypes = [
    { color: 'red', image: 'images/red-balloon.png', popImage: 'images/red-pop.png' },
    { color: 'blue', image: 'images/blue-balloon.png', popImage: 'images/blue-pop.png' },
    { color: 'green', image: 'images/green-balloon.png', popImage: 'images/green-pop.png' },
    { color: 'yellow', image: 'images/yellow-balloon.png', popImage: 'images/yellow-pop.png' },
    { color: 'orange', image: 'images/orange-balloon.png', popImage: 'images/orange-pop.png' },
    { color: 'pink', image: 'images/pink-balloon.png', popImage: 'images/pink-pop.png' },
    { color: 'purple', image: 'images/purple-balloon.png', popImage: 'images/purple-pop.png' }
];

// Digit images mapping
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
    9: 'images/no-9.png'
};

// DOM Elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startButton = document.getElementById('startButton');
const backButton = document.getElementById('backButton');
const balloonsContainer = document.getElementById('balloonsContainer');
const popSound = document.getElementById('popSound');
const scoreHundreds = document.getElementById('scoreHundreds');
const scoreTens = document.getElementById('scoreTens');
const scoreOnes = document.getElementById('scoreOnes');

// Initialize Game
function init() {
    console.log('Initializing game...');
    console.log('Start button found:', !!startButton);
    console.log('Game screen found:', !!gameScreen);
    
    if (startButton) {
        startButton.addEventListener('click', (e) => {
            console.log('Start button clicked!');
            e.preventDefault();
            startGame();
        });
        startButton.addEventListener('touchstart', (e) => {
            console.log('Start button touched!');
            e.preventDefault();
            startGame();
        });
        console.log('Start button event listeners added');
    } else {
        console.error('Start button not found!');
    }
    
    if (backButton) {
        backButton.addEventListener('click', backToMenu);
        backButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            backToMenu();
        });
    }
    
    updateScoreDisplay();
    console.log('Game initialization complete');
}

// Start Game
function startGame() {
    console.log('startGame function called');
    console.log('Start screen element:', startScreen);
    console.log('Game screen element:', gameScreen);
    
    if (startScreen) {
        startScreen.classList.remove('active');
        console.log('Removed active class from start screen');
    } else {
        console.error('Start screen not found!');
    }
    
    if (gameScreen) {
        gameScreen.classList.add('active');
        console.log('Added active class to game screen');
    } else {
        console.error('Game screen not found!');
    }
    
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.balloons = [];
    gameState.lastSpawnTime = Date.now();
    
    console.log('Game state set:', gameState);
    updateScoreDisplay();
    console.log('Starting game loop...');
    gameLoop();
}

// Back to Menu
function backToMenu() {
    gameScreen.classList.remove('active');
    startScreen.classList.add('active');
    
    gameState.isPlaying = false;
    
    // Clear all balloons
    balloonsContainer.innerHTML = '';
    gameState.balloons = [];
}

// Game Loop
function gameLoop() {
    if (!gameState.isPlaying) {
        console.log('Game not playing, stopping loop');
        return;
    }
    
    const currentTime = Date.now();
    
    // Spawn balloons
    if (currentTime - gameState.lastSpawnTime > gameState.spawnInterval && 
        gameState.balloons.length < gameState.maxBalloons) {
        console.log('Spawning balloon...');
        spawnBalloon();
        gameState.lastSpawnTime = currentTime;
        // Randomize next spawn interval
        gameState.spawnInterval = 800 + Math.random() * 700; // 0.8-1.5 seconds
    }
    
    // Update balloons
    updateBalloons();
    
    // Remove off-screen balloons
    removeOffScreenBalloons();
    
    requestAnimationFrame(gameLoop);
}

// Spawn Balloon
function spawnBalloon() {
    console.log('Creating balloon...');
    const balloonType = balloonTypes[Math.floor(Math.random() * balloonTypes.length)];
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    // Random properties
    const size = 150 + Math.random() * 80; // 120-200px (much larger to match reference)
    const startX = Math.random() * (window.innerWidth - size);
    const speed = 0.5 + Math.random() * 1; // 0.5-1.5 pixels per frame
    const swayAmount = 3 + Math.random() * 4; // 3-7 pixels sway (increased for larger balloons)
    
    balloon.style.width = size + 'px';
    balloon.style.height = size + 'px';
    balloon.style.left = startX + 'px';
    balloon.style.bottom = '-50px';
    balloon.style.backgroundImage = `url('${balloonType.image}')`;
    balloon.style.backgroundSize = 'contain';
    balloon.style.backgroundRepeat = 'no-repeat';
    balloon.style.backgroundPosition = 'center';
    
    // Add floating animation
    balloon.style.animation = `balloonFloat ${2 + Math.random() * 2}s ease-in-out infinite`;
    
    // Balloon data
    const balloonData = {
        element: balloon,
        type: balloonType,
        speed: speed,
        swayAmount: swayAmount,
        swayDirection: Math.random() > 0.5 ? 1 : -1,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayPhase: Math.random() * Math.PI * 2,
        startX: startX,
        y: -50
    };
    
    // Add click/touch event
    balloon.addEventListener('click', () => popBalloon(balloonData));
    balloon.addEventListener('touchstart', (e) => {
        e.preventDefault();
        popBalloon(balloonData);
    });
    
    console.log('Adding balloon to container...');
    balloonsContainer.appendChild(balloon);
    gameState.balloons.push(balloonData);
    console.log('Balloon added. Total balloons:', gameState.balloons.length);
}

// Update Balloons
function updateBalloons() {
    gameState.balloons.forEach(balloon => {
        if (balloon.element.classList.contains('popping')) return;
        
        // Move upward
        balloon.y += balloon.speed;
        balloon.element.style.bottom = balloon.y + 'px';
        
        // Sway motion
        balloon.swayPhase += balloon.swaySpeed;
        const swayX = Math.sin(balloon.swayPhase) * balloon.swayAmount;
        balloon.element.style.left = (balloon.startX + swayX) + 'px';
    });
}

// Pop Balloon
function popBalloon(balloonData) {
    if (balloonData.element.classList.contains('popping')) return;
    
    // Add popping class
    balloonData.element.classList.add('popping');
    
    // Change to pop image
    balloonData.element.style.backgroundImage = `url('${balloonData.type.popImage}')`;
    
    // Play sound
    popSound.currentTime = 0;
    popSound.play().catch(e => {}); // Silent fail if audio doesn't work
    
    // Increase score
    gameState.score = Math.min(gameState.score + 1, 999);
    updateScoreDisplay();
    
    // Remove balloon after animation
    setTimeout(() => {
        if (balloonData.element.parentNode) {
            balloonData.element.parentNode.removeChild(balloonData.element);
        }
        const index = gameState.balloons.indexOf(balloonData);
        if (index > -1) {
            gameState.balloons.splice(index, 1);
        }
    }, 300);
}

// Remove Off-Screen Balloons
function removeOffScreenBalloons() {
    gameState.balloons = gameState.balloons.filter(balloon => {
        if (balloon.y > window.innerHeight + 100) {
            if (balloon.element.parentNode) {
                balloon.element.parentNode.removeChild(balloon.element);
            }
            return false;
        }
        return true;
    });
}

// Update Score Display
function updateScoreDisplay() {
    const score = gameState.score;
    const hundreds = Math.floor(score / 100);
    const tens = Math.floor((score % 100) / 10);
    const ones = score % 10;
    
    scoreHundreds.src = digitImages[hundreds];
    scoreTens.src = digitImages[tens];
    scoreOnes.src = digitImages[ones];
}

// Handle Window Resize
window.addEventListener('resize', () => {
    // Adjust balloon positions if needed
    gameState.balloons.forEach(balloon => {
        if (balloon.startX > window.innerWidth - 50) {
            balloon.startX = window.innerWidth - 50;
        }
    });
});

// Handle Visibility Change (pause when tab is not active)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause game
        gameState.isPlaying = false;
    } else if (gameScreen.classList.contains('active')) {
        // Resume game
        gameState.isPlaying = true;
        gameLoop();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Fallback initialization
window.addEventListener('load', () => {
    // Double-check initialization after everything is loaded
    if (startButton && !startButton.onclick) {
        init();
    }
});

// Test function for debugging (can be called from console)
window.testGame = function() {
    console.log('=== GAME TEST START ===');
    console.log('Start button:', startButton);
    console.log('Game screen:', gameScreen);
    console.log('Balloons container:', balloonsContainer);
    console.log('Start screen:', startScreen);
    
    if (startButton) {
        console.log('Clicking start button...');
        startButton.click();
    } else {
        console.error('Start button not found!');
    }
    console.log('=== GAME TEST END ===');
};

// Test function to manually trigger start game
window.forceStartGame = function() {
    console.log('Force starting game...');
    startGame();
};

// 🌿 Animate Grass Layers
window.addEventListener('load', () => {
  const bgGrass = document.querySelector('.background-grass');
  const fgGrass = document.querySelector('.foreground-grass');
  let t = 0;

  function animateGrass() {
    t += 0.02; // speed of sway

    // Natural side-to-side motion
    const bgOffset = Math.sin(t) * 10;   // smaller movement for background
    const fgOffset = Math.sin(t * 1.5) * 20; // bigger sway for foreground

    if (bgGrass) bgGrass.style.transform = `translateX(${bgOffset}px)`;
    if (fgGrass) fgGrass.style.transform = `translateX(${fgOffset}px)`;

    requestAnimationFrame(animateGrass);
  }

  animateGrass();
});
