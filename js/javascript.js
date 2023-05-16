const types = {
	number: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
	icon: ['🐶', '🐱', '🐻', '🦊', '🐯', '🐷', '🐸', '🦁', '🐵', '🐔', '🦄', '🦓', '🐬', '🐙', '🐠', '🦑', '🐢', '🐍', '🕷️', '🦞', '🦀', '🦐', '🐋', '🐊']
};

// Get the selected options
const playerSelect = document.getElementById('player-select');
const sizeSelect = document.getElementById('size-select');
const typeSelect = document.getElementById('type-select');
const optionsPopup = document.getElementById('options-popup');

// Define the game variables
let players = [];
let currentPlayer = 0;
let score = {};
let moves = 0;
let startTime;
let timerInterval;
let currentPlayerIndex = 0;


// Define the game board
const gameBoard = document.getElementById('game-board');
numPlayers = parseInt(document.getElementById('player-select').value);

// Define the pop-up at the beginning
 const gamestate = document.getElementById('game-state');

// Define the function to start the game
function startGame() {
	gamestate.style.display = 'none';
	
	// Clear the game board
	gameBoard.innerHTML = '';

	// Create the players
	players = [];
	for (let i = 0; i < playerSelect.value; i++) {
		players.push({name: `Player ${i + 1}`, score: 0});
		score[`Player ${i + 1}`] = 0;
	}

	// Create the cards
	const cards = [];
	const type = typeSelect.value;
	const size = sizeSelect.value;

	for (let i = 0; i < size * size / 2; i++) {
		const value = types[type][i];
		cards.push({value: value, matched: false});
		cards.push({value: value, matched: false});
	}

	// Define the function to shuffle an array
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
	// start timer function
	startTimer();

	// grid
	 gameBoard.style.gridTemplateColumns = `repeat(${size}, minmax(60px, 1fr))`
	// Define the array to track selected cards
	let activeCard = null;
	let revealCount = 0;
	let awaitingEndOfMove = false;
	

	// Shuffle the cards
	shuffle(cards);

	// Create the card elements
	for (let i = 0; i < size * size; i++) {
		const card = cards[i];
		const cardElement = document.createElement('div');
		cardElement.classList.add('card');
		cardElement.dataset.value = card.value;
		cardElement.dataset.index = i;
		gameBoard.appendChild(cardElement);

		cardElement.setAttribute('data-card', card.value)
		cardElement.setAttribute('revealed-card', "false")


		cardElement.addEventListener('click', function() {
			const revealed = cardElement.getAttribute("revealed-card")

			if (awaitingEndOfMove || revealed === "true" || cardElement=== activeCard){
					return;
				}  

				cardElement.innerHTML = card.value;

				if (!activeCard) {
					activeCard = cardElement
					
					return;
				}
				const elementToMatch = activeCard.getAttribute('data-card');
				
				if (elementToMatch === card.value){
					activeCard.setAttribute("revealed-card", "true")
					cardElement.setAttribute("revealed-card", "true")
					
					awaitingEndOfMove = false;
					activeCard= null;
					revealCount += 2;

					// Add score to current player
					 players[currentPlayer].score += 1;
					 // Increment current player index
					currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

					if (revealCount === size *size){
						endGame()
					}
					return;
				}
					 
				// Reset moves
				updateMoves();

				awaitingEndOfMove = true;

				setTimeout(()=>{
					cardElement.innerHTML = null
					activeCard.innerHTML = null

					awaitingEndOfMove = false;
					activeCard= null
				}, 1000)	

})
	
function updateMoves() {
		moves++;
		const movesElement = document.getElementById('moves');
		if (movesElement){
		movesElement.textContent = `Moves: ${moves}`;
	}}
	
	}

	

	function startTimer() {
		startTime = Date.now();
		const timerElement = document.getElementById('timer');
		
		if (timerElement) {
			timerElement.classList.add('timer');
		
			timerInterval = setInterval(() => {
			const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
			timerElement.textContent = `Time: ${elapsedTime}s`;
			}, 1000);
		}
		}


	

	// Update the score board
	const scoreBoard = document.getElementById('score-board');
	scoreBoard.innerHTML = '';
	players.forEach(player => {
		const playerScore = document.createElement('div');
		playerScore.textContent = `${player.name}: ${player.score}`;
		scoreBoard.appendChild(playerScore);
	});
}

let maxScore = 0;
	let winner = null;
	players.forEach(player => {
		if (player.score > maxScore) {
			maxScore = player.score;
			winner = player.name;
		}
	});

function stopTimer() {
		clearInterval(timerInterval);
	}

function updateScores() {
	const scoresElement = document.getElementById('scores');
	scoresElement.innerHTML = '';

	if (playerSelect.value === '1') {
		players.forEach(player => {
		const playerScore = document.createElement('div');
		playerScore.classList.add("next-scores")
		playerScore.innerHTML = `
			<div class="result"><p>Time Elapsed </p><span class="time-elapsed font-big">${getTimeElapsed()}</span></div>
			<div class="result"><p>Moves Taken </p><span class="move-taken font-big">${player.score} Moves</span></div>`
		scoresElement.appendChild(playerScore);
		const resultsTitle = document.getElementById('results-title');

		resultsTitle.innerHTML = `
			<h2 class="h2-title">You did it!</h2>
			<p>Game over! Here's how you got on...</p>`
		});
	} else {
		const sortedPlayers = players.sort((a, b) => a.score - b.score);

		if (maxScore.length === 1) {
			resultsTitle.innerHTML = `
				<h2 class="h2-title">Player ${winner} wins</h2>
				<p>Game over! Here are the results…</p>
				`
		} else {
			resultsTitle.innerHTML = `
				<h2 class="h2-title">It's a tie</h2>
				<p>Game over! Here are the results…</p>
				`
		}

		sortedPlayers.forEach(player => {
		const playerScore = document.createElement('div');
		
		playerScore.textContent = `${player.name}: Matched Pairs - ${player.score}`;
		scoresElement.appendChild(playerScore);
		});
	}
	}

	function getTimeElapsed() {
		const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
		const minutes = Math.floor(elapsedTime / 60);
		const seconds = elapsedTime % 60;
		return `${minutes}m ${seconds}s`;
		}

		


// Define the function to end the game
function endGame() {
	stopTimer();
	updateScores();
	const resultPopup = document.getElementById('result-popup');
	
	resultPopup.classList.remove('hide');
	resultPopup.style.display = 'block';
	}

	 

	

	const newGameButton = document.getElementById('newgame-btn');
	newGameButton.addEventListener('click', function() {
		const resultPopup = document.getElementById('result-popup');
		resultPopup.style.display = 'none';

		gamestate.style.display = 'none';
		optionsPopup.classList.remove("hide");
		startButton.classList.remove("hide");
	});


function restartGame() {
			const resultPopup = document.getElementById('result-popup');
			resultPopup.classList.add('hide');
			startGame();
			gamestate.style.display = 'grid';
			}

			// Add event listener to restart button
				const restartButton = document.getElementById('restart-btn');
				restartButton.addEventListener('click', restartGame);


// Initialize the game
startGame();

// Add event listener to start button
const startButton = document.getElementById('startButton');
	startButton.addEventListener('click', function() {
		optionsPopup.classList.add("hide")
		startButton.classList.add("hide")
	startGame();
		gamestate.style.display = 'grid';
	});
