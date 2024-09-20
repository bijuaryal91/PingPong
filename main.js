// Initialize canvas and context
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

// Set canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Ball Properties
let ballRadius = 10;
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4 };

// Paddle Properties
let paddleHeight = 100;
let paddleWidth = 20;
let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;
let paddleSpeed = 10;

// Control Variables
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

// Player Scores
let player1Score = 0;
let player2Score = 0;

// Event listeners for controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Function to handle keydown
function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true; // Player 1 move up
  } else if (e.key === "s") {
    sPressed = true; // Player 1 move down
  }
}

// Function to handle keyup
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false; // Player 1 move up
  } else if (e.key === "s") {
    sPressed = false; // Player 1 move down
  }
}

// Function to draw paddles
function drawPaddles() {
  ctx.fillStyle = "#1E90FF";
  ctx.fillRect(10, player1Y, paddleWidth, paddleHeight); // Player 1
  ctx.fillRect(
    canvas.width - paddleWidth - 10,
    player2Y,
    paddleWidth,
    paddleHeight
  ); // Player 2
}

// Function to draw the ball
function drawBall() {
  ctx.fillStyle = "#FF5733";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

// Function to draw scores
function drawScores() {
  ctx.font = "40px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Player 1: " + player1Score, 20, 40);
  ctx.fillText("Player 2: " + player2Score, canvas.width - 200, 40);
}

// Function to draw the center line
function drawCenterLine() {
  ctx.beginPath();
  ctx.setLineDash([5, 15]); // Dashed line
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.closePath();
}

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCenterLine(); // Draw the center line
  drawPaddles();
  drawBall();
  drawScores();

  // Ball Movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball Wall Collision Detection
  if (
    ball.y + ball.dy > canvas.height - ballRadius ||
    ball.y + ball.dy < ballRadius
  ) {
    ball.dy = -ball.dy; // Reverse vertical direction
  }

  // Paddle Collision Detection
  if (
    ball.x - ballRadius < paddleWidth + 10 && // Player 1 paddle
    ball.y > player1Y &&
    ball.y < player1Y + paddleHeight
  ) {
    let hitPosition = (ball.y - player1Y) / paddleHeight; // Value between 0 and 1
    let angle = ((hitPosition - 0.5) * Math.PI) / 3; // Adjust the angle range
    ball.dx = -ball.dx * 1.1; // Reverse horizontal direction and increase speed
    ball.dy =
      4 * Math.sin(angle) * 1.1 +
      (wPressed || sPressed ? paddleSpeed * 0.5 : 0); // Update vertical direction based on hit position and paddle speed
  } else if (
    ball.x + ballRadius > canvas.width - paddleWidth - 10 && // Player 2 paddle
    ball.y > player2Y &&
    ball.y < player2Y + paddleHeight
  ) {
    let hitPosition = (ball.y - player2Y) / paddleHeight; // Value between 0 and 1
    let angle = ((hitPosition - 0.5) * Math.PI) / 3; // Adjust the angle range
    ball.dx = -ball.dx * 1.1; // Reverse horizontal direction and increase speed
    ball.dy =
      4 * Math.sin(angle) * 1.1 +
      (upPressed || downPressed ? paddleSpeed * 0.5 : 0); // Update vertical direction based on hit position and paddle speed
  }

  // Scoring
  if (ball.x + ballRadius < 0) {
    player2Score++; // Player 2 scores
    resetBall();
  } else if (ball.x - ballRadius > canvas.width) {
    player1Score++; // Player 1 scores
    resetBall();
  }

  if (player1Score === 10) {
    setTimeout(() => {
      alert("Player 1 win the game!");
      document.location.reload();
    }, 100);
  }
  if (player2Score === 10) {
    setTimeout(() => {
      alert("Player 2 win the game!");
      document.location.reload();
    }, 100);
  }

  // Player 1 Movement
  if (wPressed && player1Y > 0) {
    player1Y -= paddleSpeed;
  } else if (sPressed && player1Y < canvas.height - paddleHeight) {
    player1Y += paddleSpeed;
  }

  // Player 2 Movement (AI)
  if (upPressed && player2Y > 0) {
    player2Y -= paddleSpeed;
  } else if (downPressed && player2Y < canvas.height - paddleHeight) {
    player2Y += paddleSpeed;
  }

  // Calls the draw function recursively
  requestAnimationFrame(draw);
}

// Function to reset the ball position
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 4 * (Math.random() < 0.5 ? 1 : -1); // Randomize direction
  ball.dy = 4 * (Math.random() < 0.5 ? 1 : -1); // Randomize direction
}

// Start the game
draw();
