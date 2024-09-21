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
let player1Y = (canvas.height - paddleHeight) / 2; // AI paddle
let player2Y = (canvas.height - paddleHeight) / 2; // Human player
let paddleSpeed = 10;

// Control Variables
let upPressed = false;
let downPressed = false;

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
  }
}

// Function to handle keyup
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  }
}

// Function to draw paddles
function drawPaddles() {
  ctx.fillStyle = "#1E90FF";
  ctx.fillRect(10, player1Y, paddleWidth, paddleHeight); // AI Paddle
  ctx.fillRect(canvas.width - paddleWidth - 10, player2Y, paddleWidth, paddleHeight); // Human Player Paddle
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
  ctx.fillText("AI: " + player1Score, 20, 40); // AI score
  ctx.fillText("You: " + player2Score, canvas.width - 200, 40); // Human score
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
  if (ball.y + ball.dy > canvas.height - ballRadius || ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy; // Reverse vertical direction
  }

  // Paddle Collision Detection
  if (
    ball.x - ballRadius < paddleWidth + 10 && // Player 1 paddle (AI)
    ball.y > player1Y &&
    ball.y < player1Y + paddleHeight
  ) {
    let hitPosition = (ball.y - player1Y) / paddleHeight; // Value between 0 and 1
    let angle = ((hitPosition - 0.5) * Math.PI) / 3; // Adjust the angle range
    ball.dx = -ball.dx * 1.1; // Reverse horizontal direction and increase speed
    ball.dy = 4 * Math.sin(angle) * 1.1; // Update vertical direction based on hit position
  } else if (
    ball.x + ballRadius > canvas.width - paddleWidth - 10 && // Player 2 paddle (Human)
    ball.y > player2Y &&
    ball.y < player2Y + paddleHeight
  ) {
    let hitPosition = (ball.y - player2Y) / paddleHeight; // Value between 0 and 1
    let angle = ((hitPosition - 0.5) * Math.PI) / 3; // Adjust the angle range
    ball.dx = -ball.dx * 1.1; // Reverse horizontal direction and increase speed
    ball.dy = 4 * Math.sin(angle) * 1.1; // Update vertical direction based on hit position
  }

  // Scoring
  if (ball.x + ballRadius < 0) {
    player2Score++; // Player 2 scores
    resetBall();
  } else if (ball.x - ballRadius > canvas.width) {
    player1Score++; // Player 1 scores
    resetBall();
  }

  // Check for a winner
  if (player1Score === 10) {
    setTimeout(() => {
      alert("Player 1 wins the game!");
      document.location.reload();
    }, 100);
  }
  if (player2Score === 10) {
    setTimeout(() => {
      alert("Player 2 wins the game!");
      document.location.reload();
    }, 100);
  }

  // Player 2 Movement (Human)
  if (upPressed && player2Y > 0) {
    player2Y -= paddleSpeed;
  } else if (downPressed && player2Y < canvas.height - paddleHeight) {
    player2Y += paddleSpeed;
  }

  // AI Movement for Player 1
  const aiSpeed = 0.8; // Adjust this value for smoothness and responsiveness

  if (ball.y < player1Y + paddleHeight / 2) {
    player1Y -= paddleSpeed * aiSpeed; // Move up
  } else if (ball.y > player1Y + paddleHeight / 2) {
    player1Y += paddleSpeed * aiSpeed; // Move down
  }

  // Constrain AI paddle within canvas bounds
  player1Y = Math.max(Math.min(player1Y, canvas.height - paddleHeight), 0);

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
