// Words for each level
const words = {
    easy: ["cat", "sun", "run", "big", "red", "dog", "egg", "fun", "sky", "pie", "tea", "key", "car", "hat", "pen", "art", "sea", "bed", "cup", "arm"],
    medium: ["hello", "world", "apple", "river", "happy", "house", "light", "dream", "music", "smile", "earth", "water", "friend", "summer", "winter"],
    hard: ["javascript", "developer", "programming", "challenge", "keyboard", "asynchronous", "algorithm", "documentation", "framework", "optimization", "component", "variable", "function", "conditional", "statement"]
};

const speeds = {
    easy: 1,
    medium: 2,
    hard: 3
};

let currentLevel;
let currentWords;
let currentSpeed;

const levelSelection = document.getElementById("level-selection");
const gameScreen = document.getElementById("canvas");

const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");

const laserSound = document.getElementById("laser-sound");
const explosionSound = document.getElementById("explosion-sound");
const gameOverSound = document.getElementById("game-over-sound");
const backgroundMusic = document.getElementById("background-music");

easyBtn.addEventListener("click", () => startGame("easy"));
mediumBtn.addEventListener("click", () => startGame("medium"));
hardBtn.addEventListener("click", () => startGame("hard"));

function startGame(level) {
    currentLevel = level;
    currentWords = words[currentLevel];
    currentSpeed = speeds[currentLevel];

    levelSelection.style.display = "none";
    gameScreen.style.display = "block";
    backgroundMusic.play();
    textBox.focus();

    game.init();
}

class Word {
    constructor(x,  y, color, text, dy, time_created) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.text = text;
        this.dy = dy;
        this.time_created = time_created;
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.font = "30px Arial"
        ctx.fillText(this.text, this.x, this.y);
        const img = new Image();
        img.src = "https://png.pngtree.com/png-vector/20220223/ourmid/pngtree-cartoon-brown-meteor-clipart-png-image_4507117.png";
        ctx.drawImage(img, this.x, this.y+5, 50, 50);
    }

    update() {
        this.y += this.dy;
    }
}

class Crater {
    constructor(x,  y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        const img = new Image();
        img.src = "https://www.pngkey.com/png/detail/14-149959_explosion-sprite-sheet-png-2d-game-explosion-sprite.png";
        ctx.drawImage(img, this.x, this.y+5, 50, 50);
    }
}

class Player {
    constructor(textbox) {
        this.textbox = textbox;
        this.rocket = new Image();
        this.rocket.src = 'https://cdn.pixabay.com/photo/2013/07/12/13/52/rocket-147466_960_720.png';
        this.matched_y = -1;
        this.matched_time = Date.now();
        this.score = 0;
    }

    check_match(words) {
        for (var i = 0; i < words.length; i++) {
            if (this.textbox.value == words[i].text) {
                this.rocket_x = words[i].x;
                this.matched_y = words[i].y;
                words.splice(i, 1);
                this.textbox.value = '';
                this.matched_time = Date.now();
                this.score += 1;
                laserSound.play();
                explosionSound.play();
                return;
            }
        }
        alert('Mason, you are a silly boy. ' + this.textbox.value + ' is not a match!');
        this.textbox.value = '';
    }
}

// Defines an empty object used to specify game properties and behavior.
var game = {};

// Define canvas and context
game.canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
game.ctx = game.canvas.getContext('2d');

// Define background color
game.backgroundColor = '#FFFFFF';

// Create player
var textBox = document.createElement('input');
textBox.type = 'text';
textBox.style.position = 'absolute';
textBox.style.left = '50%';
textBox.style.top = '95%';
textBox.style.transform = 'translate(-50%, -50%)';
textBox.style.backgroundColor = 'grey';
document.body.appendChild(textBox);
game.player = new Player(textBox);
game.player.rocket_x = game.canvas.width/2;

// Defines a function to handle the game loop
game.update = function() {
    // Draw canvas background
    var img = new Image();
    img.src = "https://media.istockphoto.com/id/1271122894/photo/planet-earth-from-the-space-at-night.jpg?s=612x612&w=0&k=20&c=PU-_OdSqlMs47X3FKQQBEruZcI38QJ4XLPpYi9b7dJ4=";
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.ctx.drawImage(img, 0, 0, game.canvas.width, game.canvas.height);

    if (game.words.length < 10 && ((game.words.length == 0) || (Date.now() - game.words[game.words.length-1].time_created > 3000))) {
        var text = currentWords[Math.floor(Math.random() * currentWords.length)];
        var color = 'rgb(' + Math.floor((Math.random() + 0.1) * 255) + ',' + Math.floor((Math.random() + 0.1) * 255) + ',' + Math.floor((Math.random() + 0.1) * 255) + ')';
        var width = text.length * 20;
        var x = Math.min(Math.floor(Math.random() * game.canvas.width), game.canvas.width - (2*width));
        var word = new Word(x, 0, color, text, currentSpeed, Date.now());
        game.words.push(word);
    }

    // update words
    for (var i = 0; i < game.words.length; i++) {
        game.words[i].draw(game.ctx);
        game.words[i].update();
    }

    // update craters
    for (var i = 0; i < game.craters.length; i++) {
        game.craters[i].draw(game.ctx);
    }

    // if any word is out of canvas, remove it
    for (var i = 0; i < game.words.length; i++) {
        if ((game.words[i].y > game.canvas.height)) {
            game.craters.push(new Crater(game.words[i].x, game.words[i].y - 50));
            game.words.splice(i, 1);
            game.player.score -= 1;
            i--;
        }
    }

    // update player
    game.ctx.drawImage(game.player.rocket, game.player.rocket_x, game.canvas.height*0.8, 40, 40)
    if (game.player.matched_y > 0) {
        game.ctx.fillStyle = '#E80B08';
        game.ctx.fillRect(game.player.rocket_x + 15, game.player.matched_y + 40, 10, Math.floor(game.canvas.height*0.8) - game.player.matched_y - 40);
        const img = new Image();
        img.src = 'https://www.pngkey.com/png/detail/14-149959_explosion-sprite-sheet-png-2d-game-explosion-sprite.png';
        game.ctx.drawImage(img, game.player.rocket_x - 30, game.player.matched_y - 40, 100, 100);
    }
    if ((game.player.matched_y > 0) && (Date.now() - game.player.matched_time > 500)) {
        game.player.matched_y = -1;
    }
    game.ctx.fillStyle = 'red';
    game.ctx.font = "30px Arial"
    game.ctx.fillText('score: ' + String(game.player.score), game.canvas.width-150, 50);
    game.ctx.fillText('craters: ' + String(game.craters.length), 20, 50);
    var time_elapsed = Math.floor((Date.now() - game.start_time)/1000);
    game.ctx.fillText('time left: ' + String(game.total_time - time_elapsed), game.canvas.width/2 - 100, 50);
    if (time_elapsed >= game.total_time) {
        game.stop();
    }
}

// Defines a function to handle key events
game.keydown = function(e) {
    if (event.keyCode == 13) {
        game.player.check_match(game.words);
    }
}

// Defines a function to start the game loop
game.init = function() {
    // Set the game loop
    game.interval = setInterval(game.update, 60);
    game.words = [];
    game.craters = [];
    game.start_time = Date.now();
    game.total_time = 3 * 60;
}

// Defines a function to stop the game loop
game.stop = function() {
    clearInterval(game.interval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    gameOverSound.play();
}

// Defines a function to restart the game
game.restart = function() {
    game.stop();
    levelSelection.style.display = "block";
    gameScreen.style.display = "none";
}

// Detect key events
window.onkeydown = game.keydown;