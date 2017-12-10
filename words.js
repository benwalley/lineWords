var canvas = document.getElementById("wordsCanvas");
var ctx = canvas.getContext("2d");

var backgroundCanvas = document.getElementById("backgroundCanvas")
var backCtx = backgroundCanvas.getContext("2d")

var data = {
	number: 2000,
	speed: 4,
	size: 1, 
	background: "grey", 
	word: "BEN", 
	margin: 50,
	color: "black"
}

var circles = [];
var colors = {};
var letterSize = undefined
var longestLine = 15;


canvas.width = window.innerWidth
canvas.height = window.innerHeight

backgroundCanvas.width = window.innerWidth
backgroundCanvas.height = window.innerHeight

//create a single letter
function drawLetter(letter, size, color, x, y, context = backCtx, font = 'Helvetica'){
	context.font = "bold " + size + " Helvetica";
	context.fillStyle = color
	context.fillText(letter, x, y)
}

// array of each dot on each color

//create a word, using drawLetter function
//each letter has different color
function drawWord(word){
	arrWord = Array.from(word);
	for(var i = 0; i < arrWord.length; i++){
		//color for current letter
		var color = "rgb("+ Math.floor(255/arrWord.length) * (i+1) +",0,0)"
		var colorNumber = (Math.floor(255/arrWord.length) * (i+1))
		
		// size for current letter
		letterSize = (canvas.width- data.margin*2)/arrWord.length
		drawLetter(arrWord[i], letterSize + "px", color, data.margin+(i*letterSize),canvas.height/4 + letterSize, backCtx)
	}
}

function drawCircle(x, y, r, fill = "black"){
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI, false)
	ctx.fillStyle = fill;

	ctx.fill();
}

function drawLine(x,y,endX, endY, width = 1){
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(endX, endY);
	ctx.lineWidth = width
	ctx.strokeStyle = "white"
	ctx.stroke();
}

// call the draw word function with word from data object
drawWord(data.word)

function checkOnLetter(){
	for (var i = 0; i < circles.length; i++) {
		for (var q = 0; q < circles.length; q++) {
			if(circles[i].backgroundColor == circles[q].backgroundColor && circles[i].backgroundColor != 0){
				var length =(Math.abs(circles[i].x - circles[q].x) + Math.abs(circles[i].y - circles[q].y))/2
				if(length <= longestLine){
					drawLine(circles[i].x, circles[i].y, circles[q].x, circles[q].y, .02)
				}
				
				
			}
		}
	}
}


function createCircles(data){
	for (var i = 0; i < data.number; i++) {
		circles.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			r: Math.random() * data.size,
			dx: (Math.random() * data.speed) - data.speed/2,
			dy: (Math.random() * data.speed) - data.speed/2,
			color: data.color,
			backgroundColor: undefined
		})
	}
}

createCircles(data)

function checkCollision(x,y){
	for (var i = 0; i < circles.length; i++) {
		if(circles[i].x <= 0 || circles[i].x >= canvas.width){
			circles[i].dx = -circles[i].dx
		}
		if(circles[i].y <= 0 || circles[i].y >= canvas.height){
			circles[i].dy = -circles[i].dy
		}
	}
}

function moveCircles(){
	for (var i = 0; i < circles.length; i++) {
		circles[i].x += circles[i].dx
		circles[i].y += circles[i].dy
	}
}

function checkColor(){
	for (var i = 0; i < circles.length; i++) {
		// get color of red (0 - 255) from the point of circles, and fill their data with it
		circles[i].backgroundColor = (backCtx.getImageData(circles[i].x, circles[i].y, 1, 1)).data[0]
	}
}



function drawCircles(){
	for (var i = 0; i < circles.length; i++) {
		drawCircle(circles[i].x, circles[i].y, circles[i].r, circles[i].color)
	}
}


function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	checkCollision()
	checkColor()
	moveCircles()
	// drawCircles()
	checkOnLetter()

	window.requestAnimationFrame(draw)
}

draw()




