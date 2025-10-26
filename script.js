const game = document.getElementById('game');

// Spawn a balloon every 1 second
setInterval(createBalloon, 1000);

function createBalloon() {
  const balloon = document.createElement('div');
  balloon.classList.add('balloon');

  // Random color and position
  balloon.style.left = Math.random() * window.innerWidth + 'px';
  balloon.style.backgroundColor = getRandomColor();

  // Add pop interaction
  balloon.addEventListener('click', () => {
    balloon.classList.add('pop');
    setTimeout(() => balloon.remove(), 200);
  });

  // Remove when it reaches top
  balloon.addEventListener('animationend', () => balloon.remove());

  game.appendChild(balloon);
}

function getRandomColor() {
  const colors = ['red', 'yellow', 'green', 'blue', 'pink', 'purple'];
  return colors[Math.floor(Math.random() * colors.length)];
}
