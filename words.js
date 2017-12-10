var canvas = document.getElementById("wordsCanvas");
var ctx = canvas.getContext("2d");

var backgroundCanvas = document.getElementById("backgroundCanvas")
var backCtx = backgroundCanvas.getContext("2d")

var data = {
	number: 200,
	speed: 3,
	size: 1, 
	background: "grey", 
	word: "TEST", 
	margin: 50,
	color: "black",
	lineColor: "black",
	lineThickness: .1
}

var circles = [];
var colors = {};
var letterSize = undefined
var longestLine = 50;
var resetButton = $("#resetButton");
var startButton = $("#startButton");
var wordInput = $("#wordInput");
var numberInput = $("#numberInput");
var showDotsInput = $("#showDotsInput");
var showLinesInput = $("#showLinesInput");
var backgroundColorInput = $("#backgroundColorInput");
var ballColorInput = $("#ballColorInput");
var lineColorInput = $("#lineColorInput");
var ballSizeInput = $("#ballSizeInput");
var lineThicknessInput = $("#lineThicknessInput");
var ballSpeedInput = $("#ballSpeedInput");
var maxLineInput = $("#maxLineInput");

var showDots = true;
var showLines = true;

//whenever any input is changed, update data

var inp = $("input");

inp.change(updateData)

function updateData(){
	data.word = wordInput.val();
	data.number = numberInput.val();
	// controll whether dots are shown
	if(showDotsInput.is(":checked")){
		showDots = true
	}else if(!showDotsInput.is(":checked")){
		showDots = false
	}
	//controll whether lines are shown
	if(showLinesInput.is(":checked")){
		showLines = true
	}else if(!showLinesInput.is(":checked")){
		showLines = false
	}
	canvas.style.background = backgroundColorInput.val();
	data.color = ballColorInput.val();
	data.lineColor = lineColorInput.val();
	data.size = ballSizeInput.val()/100;
	data.lineThickness = lineThicknessInput.val()/100;
	data.speed = ballSpeedInput.val()/10
	longestLine = maxLineInput.val()/10



}


canvas.width = window.innerWidth
canvas.height = window.innerHeight

backgroundCanvas.width = window.innerWidth
backgroundCanvas.height = window.innerHeight


// functions to create words, letters, circles and lines//

//create a single letter
function drawLetter(letter, size, color, x, y, context = backCtx, font = 'Helvetica'){
	context.font = "bold " + size + " Helvetica";
	context.fillStyle = color
	context.fillText(letter, x, y)
}

function drawWord(word){
	arrWord = Array.from(word);
	for(var i = 0; i < arrWord.length; i++){
		//color for current letter
		var color = "rgb("+ Math.floor(255/arrWord.length) * (i+1) +",0,0)"
		var colorNumber = (Math.floor(255/arrWord.length) * (i+1))
		
		// size for current letter
		letterSize = (canvas.width- data.margin*2)/arrWord.length
		drawLetter(arrWord[i], letterSize + "px", color, data.margin+(i*letterSize),letterSize + canvas.height/5, backCtx)
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
	ctx.strokeStyle = data.lineColor
	ctx.stroke();
}

function start(){
	cancelAnimationFrame(myAnimation)
	circles = []
	backCtx.clearRect(0,0,canvas.width,canvas.height);
	drawWord(data.word)
	updateData()
	createCircles(data);
	myAnimation = requestAnimationFrame(draw)
}

// call the draw word function with word from data object
drawWord(data.word)

// check if any two circles are on the same letter. if they are, draw line between them
// currently it will draw it both ways. it could be improved
function checkOnLetter(){
	for (var i = 0; i < circles.length; i++) {
		for (var q = 0; q < circles.length; q++) {
			if(circles[i].backgroundColor == circles[q].backgroundColor && circles[i].backgroundColor != 0){
				var length =(Math.abs(circles[i].x - circles[q].x) + Math.abs(circles[i].y - circles[q].y))/2
				if(length <= longestLine){
					drawLine(circles[i].x, circles[i].y, circles[q].x, circles[q].y, data.lineThickness)
				}
				
				
			}
		}
	}
}

// fill the array with data
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

// check if any balls hit walls. if they do, reverse velocity
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

//move all circles, based on dx and dy
function moveCircles(){
	for (var i = 0; i < circles.length; i++) {
		circles[i].x += circles[i].dx
		circles[i].y += circles[i].dy
	}
}

// check what color the ball is over, on the background image. then put the red value in the backgroundColor data
function checkColor(){
	for (var i = 0; i < circles.length; i++) {
		// get color of red (0 - 255) from the point of circles, and fill their data with it
		circles[i].backgroundColor = (backCtx.getImageData(circles[i].x, circles[i].y, 1, 1)).data[0]
	}
}


// draw all the circles, based on x and y, and r
function drawCircles(){
	for (var i = 0; i < circles.length; i++) {
		drawCircle(circles[i].x, circles[i].y, circles[i].r, circles[i].color)
	}
}

// draw everything, and request animation frame
function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	checkCollision()
	checkColor()
	moveCircles()

	if(showDots){
		drawCircles()
	}
	if(showLines){
		checkOnLetter()
	}
	

	myAnimation = requestAnimationFrame(draw)
}

myAnimation = requestAnimationFrame(draw)




