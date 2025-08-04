// Constants and variables
let inputDirection = { x: 0, y: 0 };
const eatSound = new Audio("asset/eat.wav");
const moveSound = new Audio("asset/move.mp3");
const gameoverSound = new Audio("asset/game-over.mp3");
const bgMusic = new Audio("asset/music.mp3");
let speed = 9;
let lasttime = 0;
let board = document.getElementById("board");
let snakeArray = [{ x: 13, y: 15 }];
let food = { x: 10, y: 15 };
let score = 0;
let scoreText = document.getElementById("score");
let hiscoreBox = document.getElementById("hiscore");

// Handle high score from localStorage
let hiscore = localStorage.getItem("hiscore");
let hiscoreval;
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
}
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

// Game loop
function main(currenttime) {
  window.requestAnimationFrame(main);
  if ((currenttime - lasttime) / 1000 < 1 / speed) return;
  lasttime = currenttime;
  gameEngine();
}

// Collision detection
function isCollide(snake) {
  // Snake hits itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  // Snake hits wall
  return (
    snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0
  );
}

// Game logic
function gameEngine() {
  // 1. Handle collision
  if (isCollide(snakeArray)) {
    gameoverSound.play();
    bgMusic.pause();
    inputDirection = { x: 0, y: 0 };
    alert("Game Over. Press any key to restart.");
    snakeArray = [{ x: 13, y: 15 }];
    score = 0;
    scoreText.innerHTML = "Score: " + score;
    bgMusic.currentTime = 0;
    bgMusic.play();
    return;
  }

  // 2. If snake eats food
  if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) {
    eatSound.play();
    score += 1;
    scoreText.innerHTML = "Score: " + score;

    // Update high score
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
    }

    // Grow the snake
    snakeArray.unshift({
      x: snakeArray[0].x + inputDirection.x,
      y: snakeArray[0].y + inputDirection.y,
    });

    // Generate new food
    let a = 2,
      b = 16;
    food = {
      x: Math.floor(a + Math.random() * (b - a + 1)),
      y: Math.floor(a + Math.random() * (b - a + 1)),
    };
  }

  // 3. Move the snake
  for (let i = snakeArray.length - 2; i >= 0; i--) {
    snakeArray[i + 1] = { ...snakeArray[i] };
  }
  snakeArray[0].x += inputDirection.x;
  snakeArray[0].y += inputDirection.y;

  // 4. Render snake and food
  board.innerHTML = "";
  snakeArray.forEach((segment, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add(index === 0 ? "head" : "snake");
    board.appendChild(snakeElement);
  });

  // Render food
  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Start the game
bgMusic.play();
// window.requestAnimationFrame(main);

// Controls
window.addEventListener("keydown", (e) => {
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      if (inputDirection.y !== 1) inputDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (inputDirection.y !== -1) inputDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (inputDirection.x !== 1) inputDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (inputDirection.x !== -1) inputDirection = { x: 1, y: 0 };
      break;
  }
});
document.getElementById("resetHighScore").addEventListener("click", () => {
  localStorage.removeItem("hiscore"); // hiscore ko delete karo
  hiscoreval = 0;
  hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
  alert("High Score has been reset!");
});

document.getElementById("startBtn").addEventListener("click", () => {
  if (!bgMusic.paused) return;
  bgMusic.play();
  window.requestAnimationFrame(main);
});
