var ball;
var paddle;
var score;
var playingArea;

// variables for the setting menu
var gear;
var controls;
var newButton;
var difficultySelect;
var doneButton;

// for sounds
var snd;
var music;

var aWidth;
var aHeight;
var pWidth;
var pHeight;
var dx = 2;
var dy = 2;
var pdx = 48; // number of pixels the paddle will move
var currentScore = 0;
var timer;
var paddleLeft = 228;
var ballLeft = 100;
var ballTop = 8;

var drag = false;

// flags for sounds
var sndEnabled = false;
var musicEnabled = false;

// variables for the sound effects
var beepX;
var beepY;
var beepPaddle;
var beepGameOver;
var bgMusic;

// event listener
window.addEventListener('load', init);
window.addEventListener('resize', init); // makes the screen dynamic

function init(){
	ball = document.getElementById('ball');
	paddle = document.getElementById('paddle');
	score = document.getElementById('score');
	playingArea = document.getElementById('playingArea');

	// initialization of the buttons for the settings
	gear = document.getElementById('gear');
	controls = document.getElementById('controls');
	newButton = document.getElementById('new');
	difficultySelect = document.getElementById('difficulty');
	doneButton = document.getElementById('done');

	// for sounds
	snd = document.getElementById('snd');
	music = document.getElementById('music');

	layoutPage();
	document.addEventListener('keydown', keyListener, false);

	// event listeners for mouse and touch events:
	playingArea.addEventListener('mousedown', mouseDown, false);
	playingArea.addEventListener('mousemove', mouseMove, false);
	playingArea.addEventListener('mouseup', mouseUp, false);

	playingArea.addEventListener('touchstart', mouseDown, false);
	playingArea.addEventListener('touchmove', mouseMove, false);
	playingArea.addEventListener('touchend', mouseUp, false);

	// event listeners for the settings:
	gear.addEventListener('click', showSettings, false);
	newButton.addEventListener('click', newGame, false);
	doneButton.addEventListener('click', hideSettings, false);
	difficultySelect.addEventListener('change', function(){
		setDifficulty(difficultySelect.selectedIndex)
	}, false);

	// event listener for toggling sound and music:
	snd.addEventListener('click', toggleSound, false);
	music.addEventListener('click', toggleMusic, false);

	timer = requestAnimationFrame(start);
}

function layoutPage(){
	aWidth = innerWidth;
	aHeight = innerHeight;
	pWidth = aWidth - 22;
	pHeight = aHeight - 22;
	playingArea.style.width = pWidth + 'px';
	playingArea.style.height = pHeight + 'px';
}

function keyListener(e){
	var key = e.keyCode;

	// checks left arrow and A key presses, and if the paddle is within the boundaries
	if((key == 37 || key == 65) && paddleLeft > 0){
		paddleLeft = paddleLeft - pdx;
		if(paddleLeft < 0){
			paddleLeft = 0;
		}
	}

	// checks right arrow and W key presses, and if the paddle is within the boundaries
	else if((key == 39 || key == 68) && paddleLeft < pWidth - 64){
		paddleLeft = paddleLeft + pdx;
		if(paddleLeft > pWidth - 64){
			paddleLeft = pWidth - 64;
		}
	}

	paddle.style.left = paddleLeft + 'px';
}

function start(){
	render();
	detectCollisions();
	difficulty();
	if(ballTop < pHeight - 36){
		timer = requestAnimationFrame(start);
	}
	else{
		gameOver();
	}
}

function render(){
	moveBall();
	updateScore();
}

function moveBall(){
	ballLeft = ballLeft + dx;
	ballTop = ballTop + dy;
	ball.style.left = ballLeft + 'px';
	ball.style.top = ballTop + 'px';
}

function updateScore(){
	currentScore = currentScore + 5;
	score.innerHTML = "Score: " + currentScore;
}

function detectCollisions(){
	if(collisionX()){
		dx = dx * -1;
	}

	if(collisionY()){
		dy = dy * -1;
	}
}

function collisionX(){
	if(ballLeft < 4 || ballLeft > pWidth - 20){
		playSound(beepX);
		return true; // collision happened
	}

	return false; // no collision
}

function collisionY(){
	if(ballTop < 4){
		playSound(beepY);
		return true; //collision at the top happened
	}

	if(ballTop > pHeight - 64){
		/*
		if(ballLeft >= paddleLeft && ballLeft <= paddleLeft + 64){
			return true; // collided with the paddle
		}
		*/

		// checking if ball hit the middle of the paddle:
		if(ballLeft >= paddleLeft + 16 && ballLeft < paddleLeft + 48){
            if(dx < 0){
                dx = -2;
            }else{
                dx = 2;
            }
			playSound(beepPaddle);
            return true;
        }

		// checking if ball hit the left edge of the paddle:
		else if(ballLeft >= paddleLeft && ballLeft < paddleLeft + 16){
            if(dx < 0){
                dx = -8;
            }else{
                dx = 8;
            }
			playSound(beepPaddle);
            return true;
        }

		// checking if ball hit the right edge of the paddle:
		else if(ballLeft >= paddleLeft + 48 && ballLeft <= paddleLeft + 64){
            if(dx < 0){
                dx = -8;
            }else{
                dx = 8;
            }
			playSound(beepPaddle);
            return true;
        }
	}

	return false;
}

function difficulty(){
	if(currentScore % 1000 == 0){
		if(dy > 0){
			dy = dy + 2;
		}

		else{
			dy = dy - 2;
		}
	}
}

function gameOver(){
	cancelAnimationFrame(timer);
	score.innerHTML += "	Game Over!";
	score.style.backgroundColor = 'rgb(128, 0, 0)';
	playSound(beepGameOver);
}

function mouseDown(e){
	drag = true;
}

function mouseUp(e){
	drag = false;
}

function mouseMove(e){
	if(drag){
		e.preventDefault(); // prevents both mouse and touch events from occuring
		paddleLeft = e.clientX - 32 || e.targetTouches[0].pageX - 32;
		if(paddleLeft < 0){
			paddleLeft = 0;
		}
		if(paddleLeft > (pWidth - 64)){
			paddleLeft = pWidth - 64;
		}
		paddle.style.left = paddleLeft + 'px';
	}
}

function showSettings(){
	controls.style.display = 'block';
	cancelAnimationFrame(timer);
}

function hideSettings(){
	controls.style.display = 'none';
	timer = requestAnimationFrame(start);
}

function setDifficulty(diff){
	switch(diff){
		// Easy
		case 0:
			dy = 2;
			pdx = 48;
			break;

		// Medium
		case 1:
			dy = 4;
			pdx = 32;
			break;

		// Difficult
		case 2:
			dy = 6;
			pdx = 16;
			break;

		default:
			dy = 2;
			pdx = 48;
	}
}

function newGame(){
	ballTop = 8;
	currentScore = 0;
	dx = 2;
	setDifficulty(difficultySelect.selectedIndex);
	score.style.backgroundColor = 'rgb(32, 128, 64)';
	hideSettings();
}

// for playing sounds in mobile device
function initAudio(){
    //load audio files
    beepX = new Audio('sounds/beepX.mp3');
    beepY = new Audio('sounds/beepY.mp3');
    beepPaddle = new Audio('sounds/beepPaddle.mp3');
    beepGameOver = new Audio('sounds/beepGameOver.mp3');
    bgMusic = new Audio('sounds/music.mp3');

    //turn off volume
    beepX.volume = 0;
    beepY.volume = 0;
    beepPaddle.volume = 0;
    beepGameOver.volume = 0;
    bgMusic.volume = 0;

    //play each file
    //this grants permission
    beepX.play();
    beepY.play();
    beepPaddle.play();
    beepGameOver.play();
    bgMusic.play();

    //pause each file
    //this stores them in memory for later
    beepX.pause();
    beepY.pause();
    beepPaddle.pause();
    beepGameOver.pause();
    bgMusic.pause();

    //set the volume back for next time
    beepX.volume = 1;
    beepY.volume = 1;
    beepPaddle.volume = 1;
    beepGameOver.volume = 1;
    bgMusic.volume = 1;
}

function toggleSound(){
	if(beepX == null){
		initAudio();
	}

	sndEnabled = !sndEnabled;
}

function playSound(objSound){
	if(sndEnabled){
		objSound.play();
	}
}

function toggleMusic(){
	if(bgMusic == null){
		initAudio();
	}

	if(musicEnabled){
		bgMusic.pause();
	}
	else{
		bgMusic.loop = true;
		bgMusic.play();
	}

	musicEnabled = !musicEnabled;
}
