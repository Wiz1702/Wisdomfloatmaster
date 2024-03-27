var myGamePiece;
var myObstacles = [];
var myScore;

function startGame() {
    myGamePiece = new component(30, 30, "yellow", 10, 120);
    myGamePiece.gravity = 3;
    myScore = new component("30px", "Castellar", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.getElementById("gameCanvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() // Updates game area based on certain conditions
{
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

  if (myGamePiece.y >= myGameArea.canvas.height || myGamePiece.y + myGamePiece.height <= 0) {
      // Player has gone out of the game area
      clearInterval(myGameArea.interval);
      var gameOverMessage = "Game Over, you scored " + myGameArea.frameNo;
      ctx = myGameArea.context;
      ctx.fillStyle = "black";
      ctx.font = "30px Times New Roman";
      ctx.fillText(gameOverMessage, 100, 150);
      return;
  }
    for (i = 0; i < myObstacles.length; i += 1) {
       if (myGamePiece.crashWith(myObstacles[i])|| (myGamePiece.x > myGameArea.canvas.width) ){
            clearInterval(myGameArea.interval);
            var gameOverMessage = "Game Over, you scored " + myGameArea.frameNo;
            ctx = myGameArea.context;
            ctx.fillStyle = "black";
            ctx.font = "30px Times New Roman";
            ctx.fillText(gameOverMessage, 100, 150);
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "red", x, 0));
        myObstacles.push(new component(10, x - height - gap, "red", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}
// Restarts the game
function speedupGame() {
    myGameArea.clear();
    myGameArea.frameNo = 0;
    myObstacles = [];
    startGame();
}
// Event listener for the spacebar key
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        accelerate(-0.2); // Jump when spacebar is pressed
    }
});

document.addEventListener("keyup", function(event) {
    if (event.code === "Space") {
        accelerate(0.05); // Reset gravity when spacebar is released
    }
});
// Event listeners for the jump button (mousedown and touchstart for mobile devices)
document.getElementById("jumpButton").addEventListener("mousedown", function() {
    accelerate(-0.2); // Jump when button is pressed
});

document.getElementById("jumpButton").addEventListener("mouseup", function() {
    accelerate(0.05); // Reset gravity when button is released
});

document.getElementById("jumpButton").addEventListener("touchstart", function() {
    accelerate(-0.2); // Jump when button is touched
});

document.getElementById("jumpButton").addEventListener("touchend", function() {
    accelerate(0.05); // Reset gravity when button is released
});

function everyinterval(n) //Ensures that the function is called every n frames(makes sure the square is within the right interval)
{
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) // This function calls the mygamePiece.gravity function when the jump button is pressed.
{
    myGamePiece.gravity = n;
}

// Event listener for the restart button
document.getElementById("speedButton").addEventListener("click", function() {
    speedupGame();
});

// Event listeners for the jump button
document.getElementById("jumpButton").addEventListener("mousedown", function() {
    accelerate(-0.2);
});

document.getElementById("jumpButton").addEventListener("mouseup", function() {
    accelerate(0.05);
});

// Initialize the game when the window loads
window.onload = startGame;

