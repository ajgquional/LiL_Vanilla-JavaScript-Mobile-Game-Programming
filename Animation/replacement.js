var imgArray = new Array();
// creating an array to hold image objects
for(i = 0; i < 24; i++){
	imgArray[i] = new Image();
	imgArray[i].src = 'images/ball' + i + '.gif';
}

var counter = 0; // represents frames

function rotate(){
	if(counter > imgArray.length - 1){
		counter = 0;
	}
	document.getElementById('ball').src = imgArray[counter].src;
	counter++;
	setTimeout('rotate()', 50);
}

// event listener
window.addEventListener('load', rotate);
