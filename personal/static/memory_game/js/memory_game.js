//constants
SIZE = 52;
PAIR = 2;
SUITS = new Array('Spades', 'Hearts', 'Diamonds', 'Clubs');
cardWidth = 200;
cardHeight = 249;
		
var cardA;
var cardB;
var timeout;
var cardSet = new Array();
var preLoadImages = new Array();
var documentObject;
var flipped;
var flipping;
var guessCards;
var pairedCards;
var cardNumber = 0;
var delayShowCards;
var delayFlipCards;
var imgLocation = "../static/memory_game/img/"
		
setGame();
playGame();
		
//sets up the game title, area and button divs
function setGame(){    
	var tabString = '<table id="cardTable" border = "1" align="center">';
	documentObject = document.getElementById('titleArea');
	documentObject.innerHTML = '<h1 id="title" align = "center">MEMORY GAME</h1>';
		for(var i = 0; i<=3; i++){   
			tabString += '<tr>';
			for(var j = 0; j<=12; j++){
				var cardId = (j+(i*13));
				tabString += '<td><img id= "'+cardId+'" src = "'+imgLocation+'back.gif" onclick ="selectCard('+cardId+')"/></td>';
			}
			tabString += '</tr>';
		}
	tabString += '</table>';
	documentObject = document.getElementById('gameArea');
	documentObject.innerHTML += tabString;
	documentObject = document.getElementById('buttonArea');
	documentObject.setAttribute("align","center");
	documentObject.innerHTML += '<br><input type = "button" id="stopGame" value = "Stop Game" onclick = "stopGame()" width = "600"/>';
	documentObject.innerHTML += '<input type = "button" id="showCards" value = "Show Cards" onclick = "showCards()" width = "600"/>';
	documentObject.innerHTML += '<input type = "button" id="flipCards" value = "Flip Cards" onclick = "flipAllCards()" width = "600"/>';
} 
//returns true if cardId from card clicked on is same as card in pairedCards array
function isPairedCard(cardId) {
	var match = false;
	for(i in pairedCards){
		if((pairedCards[i][0]==cardSet[cardId]||pairedCards[i][1]==cardSet[cardId]) && !match){
			match = true;
		}
	}
	return match;
}
//returns true if cards in guessCards array are the same, used in selectCard function
function isSameRank(card1,card2) {
	var match = false;
	var cardX, cardY;
	cardX = card1/13;
	cardX = Math.round(100*(cardX-Math.floor(cardX)))/100;
	cardY = card2/13;
	cardY = Math.round(100*(cardY-Math.floor(cardY)))/100;
	if (cardX==cardY) {
		match = true;
	}
	return match;
}
//selects cards from table, adds them to pairedCards array if they have the same rank
function selectCard(card) {
	var imageRef2;	
	if(!isPairedCard(card)&&!flipping) {
		imageRef2 = document.getElementById(card);
		imageRef2.src = preLoadImages[card].src
		imageRef2.width = cardWidth;
		imageRef2.height = cardHeight;
		//only adds card to guessCards array if no entry in guessCards cards and cards flipped
		if(guessCards[0]==undefined&&flipped){
			guessCards[0] = cardSet[card];
			cardA=card;
		}
		else if(!guessCards[1] && flipped && cardSet[card] != guessCards[0]){
			guessCards[1] = cardSet[card];
			cardB=card;
		}
		if (guessCards.length==2) {
			if(isSameRank(guessCards[0],guessCards[1])){
				pairedCards.push([guessCards[0],guessCards[1]]);
				guessCards = new Array();
			}
			else {
				//flips guessed cards back over if not matching pair
				var flipTwo = function(){
					if(!isNaN(cardA)) {
						imageRef = document.getElementById(cardA);
						imageRef.src = imgLocation+"back.gif";
						imageRef = document.getElementById(cardB);
						imageRef.src = imgLocation+"back.gif";
					}
					cardA = "";
					cardB = "";
					flipping = false;
				};
				flipping = true;
				setTimeout(function(){flipTwo()},250);
				guessCards = new Array();
			}
		}
	}
}
//preloads the card images, sets cardSet. Initializes card arrays, starts timer
function playGame() {
	for(i=0; i<SIZE; i++){
		cardSet[i] = i;
		preLoadImages[i] = new Image(); 
	}
	shuffleCards(cardSet);
	for(i in preLoadImages) {
		preLoadImages[i].src = imgLocation+cardSet[i]+'.png';
	}
	pairedCards = new Array();
	guessCards = new Array();
	flipAllCards();
	timer(60);
}
//shows faces of all cards
function showCards(){
	flipped = false;
	document.getElementById('showCards').onclick = null;
	document.getElementById('flipCards').onclick = null;
	var timeDelay = 8;
	var imageRef2 = document.getElementById(cardNumber);
	imageRef2.src = preLoadImages[cardNumber].src;
	imageRef2.width = cardWidth;
	imageRef2.height = cardHeight;
	cardNumber++;
	if (cardNumber<SIZE) {
		timeDelay+=timeDelay;
		delayShowCards = setTimeout(function (){showCards(cardNumber)},timeDelay);
	}
	else {
		cardNumber = 0;
		document.getElementById('showCards').onclick = showCards;
		document.getElementById('flipCards').onclick = flipAllCards;
	}	
}
//flips cards face down if not correctly guessed cards
function flipAllCards(){
	flipping=true;
	document.getElementById('showCards').onclick = null;
	document.getElementById('flipCards').onclick = null;
	var timeDelay = 8;
	var imageRef = document.getElementById(cardNumber);
	if (cardNumber<SIZE&&!isPairedCard(cardNumber)) {
		imageRef.src = imgLocation+"back.gif";
		cardNumber++;
		timeDelay+=timeDelay;
		delayflipCards = setTimeout(function (){flipAllCards(cardNumber)},timeDelay);
	}
	else if (cardNumber<SIZE) {
		cardNumber++;
		delayflipCards = setTimeout(function (){flipAllCards(cardNumber)},timeDelay);
	}
	else {
		cardNumber = 0;
		document.getElementById('showCards').onclick = showCards;
		document.getElementById('flipCards').onclick = flipAllCards;
		flipping = false;
		flipped = true;
	}	
}
//function to shuffle cards in cardSet array
function shuffleCards(array){
	var randIndex = 0;
	var elementsRemaining = array.length;
	var temp;
	while (elementsRemaining>1){
		randIndex = Math.floor(Math.random() * elementsRemaining);
		temp = array[elementsRemaining-1];
		array[elementsRemaining-1] = array[randIndex];
		array[randIndex] = temp;
		elementsRemaining--;
	}   	
}
//timer function displays remaining time on screen down to 1. At zero, calls StopGame function.
function timer(time) {
	var timeDelay = 500;
	document.getElementById("title").innerHTML = "Memory Game (" +time+ " seconds left)";
	time--;
	if (time>0) {
		timeDelay+=timeDelay;
		timeout = setTimeout(function (){timer(time)},timeDelay);
	}
	if (time==0) {
		stopGame();
	}
}
//function ends timer, calls sortCards function, displays game result and calls playGame to restart game.
function stopGame() {
	clearTimeout(timeout);
	sortCards(pairedCards);
	var cardRank;
	var suitA;
	var suitB;
	var resultString = "";
	for (i in pairedCards) {
		cardRank = pairedCards[i][0]/13;
		suitA = Math.floor(cardRank);
		cardRank = Math.round((cardRank-suitA)*13+1);
		suitB = Math.floor(pairedCards[i][1]/13);
		if (cardRank==1) {
			cardRank="Ace";
		}
		else if (cardRank==11) {
			cardRank="Jack";
		}
		else if (cardRank==12) {
			cardRank="Queen";
		}
		else if (cardRank==13) {
			cardRank="King";				
		}
		resultString += cardRank+" of "+SUITS[suitA]+" - "+cardRank+" of "+SUITS[suitB]+"\n";
	}
	if (pairedCards.length>0) {
		resultString = "You have found "+pairedCards.length+" pairs:\n\n"+resultString;
	}
	else {
		resultString = "Better luck next time.";
	}
	alert(resultString);
	playGame();
}
//sortCards function sorts pairedCards array based on card ranks, in ascending order
function sortCards(array) {
	var temp;
	var cardOne;
	var cardTwo;
	for (var i = 0; i<array.length; i++) {
		for (var j = 0; (j<array.length - i -1); j++) {
			if (array.length>1 && j+1!= array.length) {
				cardOne = array[j][0]/13;
				temp = Math.floor(cardOne);
				cardOne-= temp;
				cardTwo = array[j+1][0]/13;
				temp = Math.floor(cardTwo);
				cardTwo -= temp;
				if (cardOne>cardTwo) {
					temp = array[j];
					array[j] = array [j+1];
					array[j+1] = temp;
				}
			}
		}
	}
}
