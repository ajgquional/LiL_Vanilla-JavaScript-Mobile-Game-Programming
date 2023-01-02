var currentX = 100;
var currentY = 100;
var dx = 5;
var dy = 5;

function animate(){
	document.getElementById('ball').style.left = currentX + 'px';
	document.getElementById('ball').style.top = currentY + 'px';
	currentX = currentX + dx;
	currentY = currentY + dy;
	if((currentX > 800 || currentX < 100) || (currentY > 600 || currentY < 100)){
		// change the direction of the ball
		dx = dx * -1;
		dy = dy * -1;
	}
	setTimeout('animate()', 10);
}

// event listener
window.addEventListener('load', animate);
