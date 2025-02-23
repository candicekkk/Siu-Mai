const startScreen = document.querySelector(".start-screen");
const startGameBtn = document.getElementById("startGameBtn");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.querySelector(".score-board");
const controls = document.querySelector(".controls");
let missedCount = 0;
let gameOver = false;

canvas.width = 400;
canvas.height = 500;

const player = {
    x: 210,
    y: 450,
    width: 80,
    height: 50,
    speed: 5,
    moveLeft: false,
    moveRight: false,
    image: new Image()
};
player.image.src = "image/bowl.png";

const siuMaiList = [];
const siuMaiImage = new Image();
siuMaiImage.src = "image/siu-mai.png";

let score = 0;

function startGame() {
    startScreen.style.display = "none";
    canvas.style.display = "block";
    scoreBoard.style.display = "block";
    controls.style.display = "block";
    spawnSiuMai();
    update();
}

function spawnSiuMai() {
    setInterval(() => {
        siuMaiList.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 60,
            height: 60,
            speed: 3 + Math.random() * 2,
            rotation: Math.random() * Math.PI * 2 // Random initial rotation
        });
    }, 1000);
}

function update() {
    if (gameOver) return; // Stop updating if game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the player
    if (player.moveLeft) player.x -= player.speed;
    if (player.moveRight) player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    for (let i = 0; i < siuMaiList.length; i++) {
        let siuMai = siuMaiList[i];
        siuMai.y += siuMai.speed;
        siuMai.rotation += 0.05; // Rotation effect

        // Check if siu mai is caught
        if (
            siuMai.y + siuMai.height >= player.y &&
            siuMai.x + siuMai.width >= player.x &&
            siuMai.x <= player.x + player.width
        ) {
            score++;
            document.getElementById("score").textContent = score;
            siuMaiList.splice(i, 1);
            i--;
            continue;
        }

        // If Siu Mai falls off screen
        if (siuMai.y > canvas.height) {
            missedCount++;
            siuMaiList.splice(i, 1);
            i--;

            if (missedCount >= 3) {
                endGame();
                return;
            }
        }
    }

    // Draw player
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    // Draw rotating Siu Mai
    for (const siuMai of siuMaiList) {
        ctx.save();
        ctx.translate(siuMai.x + siuMai.width / 2, siuMai.y + siuMai.height / 2);
        ctx.rotate(siuMai.rotation);
        ctx.drawImage(siuMaiImage, -siuMai.width / 2, -siuMai.height / 2, siuMai.width, siuMai.height);
        ctx.restore();
    }

    requestAnimationFrame(update);
}


document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.moveLeft = true;
    if (e.key === "ArrowRight") player.moveRight = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") player.moveLeft = false;
    if (e.key === "ArrowRight") player.moveRight = false;
});

// Button Controls
document.getElementById("leftBtn").addEventListener("mousedown", () => player.moveLeft = true);
document.getElementById("rightBtn").addEventListener("mousedown", () => player.moveRight = true);
document.getElementById("leftBtn").addEventListener("mouseup", () => player.moveLeft = false);
document.getElementById("rightBtn").addEventListener("mouseup", () => player.moveRight = false);

// Mobile Touch Support
document.getElementById("leftBtn").addEventListener("touchstart", () => player.moveLeft = true);
document.getElementById("rightBtn").addEventListener("touchstart", () => player.moveRight = true);
document.getElementById("leftBtn").addEventListener("touchend", () => player.moveLeft = false);
document.getElementById("rightBtn").addEventListener("touchend", () => player.moveRight = false);

startGameBtn.addEventListener("click", startGame);

function endGame() {
    gameOver = true;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);

    // Disable player movement
    player.moveLeft = false;
    player.moveRight = false;
}
