var model = {
//the following models set up the view of the game
	boardSize: 7, 
	numFlow: 3,  
	flowLength: 3,
	flowerDry: 0, 
	
	flowers: [  
				{ locations: [0, 0, 0], hits: ["", "", ""] },
				{ locations: [0, 0, 0], hits: ["", "", ""] },
				{ locations: [0, 0, 0], hits: ["", "", ""] }
			  ],
	water: function(guess) {
		for (var i = 0; i < this.numFlow; i++) {
			var flower = this.flowers[i];
			var index = flower.locations.indexOf(guess);
			
			if (flower.hits[index] === "hit"){
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				flower.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				
				if (this.isDry(flower)){
					view.displayMessage ("You watered the pot!"); 
					this.flowerDry++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
	
	
	isDry: function(flower) {
		for (var i = 0; i < this.flowLength; i++){
			if (flower.hits[i] !== "hit") {
				return false;
				}
			}
			return true;
	},
	
	generateFlowerLocations: function() {
		var locations;
		for (var i = 0; i < this.numFlow; i++) {
			do {
				locations = this.generateFlower();
			} while (this.collision(locations));
			this.flowers[i].locations = locations;
		}
		console.log("Flowers array: ");
		console.log(this.flowers);
	},

	generateFlower: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.flowLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.flowLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}
		
		var newFlowerLocations = [];
		for (var i = 0; i < this.flowLength; i++) {
			if (direction === 1) {
				newFlowerLocations.push(row + "" + (col + i));
			} else {
				newFlowerLocations.push((row + i) + "" + col);
				}
			}
		return newFlowerLocations;
	},

collision: function(locations) {
		for (var i = 0; i < this.numFlow; i++) {
			var flower = this.flowers[i];
			for (var j = 0; j < locations.length; j++) {
				if (flower.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
};  


var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}

};


var controller = {
	guesses: 0, 
	
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++; 
			var hit = model.water(location);
			if (hit && model.flowerDry === model.numFlow) {
				view.displayMessage("You watered all the flowers, in " + this.guesses + " guesses");
			}							
		}
	}
} 

// helper function to parse a guess from the user

function parseGuess (guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	 
	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter or number from the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		 if (isNaN(row) || isNaN(column)) {
			alert("Whoops, that isn't on the board!"); 
		} else if (row < 0 || row >= model.boardSize || 
					column < 0 || column>= model.boardSize) {
		  alert("Oops, that's off the board!");
		} else {
	      return row + column;
	    }
	}
	return null;
}

// event handlers

function handleWaterButton() {
	//get  players guess from the form and bring it to the controller
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();
	
	controller.processGuess(guess);
	
	guessInput.value = "";
} 
	
	
function handleKeyPress(e){
	var waterButton = document.getElementById("waterButton");
	
	// in IE9 and earlier: the event object doesn't 
	//get passed to the event handler correctly, so:

	e = e || window.event;
	
	if (e.keyCode === 13) {
		waterButton.click ();
		return false;
	}
}

// init - called when the page has completed loading

window.onload = init;


function init () { 
		var waterButton = document.getElementById("waterButton"); 
		waterButton.onclick = handleWaterButton;
		
		var guessInput = document.getElementById("guessInput");
		guessInput.onkeypress = handleKeyPress;
		
		model.generateFlowerLocations();
	}

