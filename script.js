// Game state variables
        let gameBoard = document.getElementById('game-board');
        let movesDisplay = document.getElementById('moves');
        let matchesDisplay = document.getElementById('matches');
        let timerDisplay = document.getElementById('timer');
        let grid4Btn = document.getElementById('grid4-btn');
        let grid6Btn = document.getElementById('grid6-btn');
        let newGameBtn = document.getElementById('new-game-btn');
        let winMessage = document.getElementById('win-message');
        let finalMoves = document.getElementById('final-moves');
        let finalTime = document.getElementById('final-moves');
        let playAgainBtn = document.getElementById('play-again-btn');

        let cards = [];
        let flippedCards = [];
        let moves = 0;
        let matches = 0;
        let gameStarted = false;
        let timer = 0;
        let timerInterval = null;
        let currentGridSize = 4; // Default Grid size
        let totalPairs = 8; // Default pairs count;
        
        // Emoji sets for cards
        const emojiSets = {
            4: ["🍎", "🍌", "🍒", "🍇", "🍊", "🍓", "🍋", "🍉"],
            6: ["🍎", "🍌", "🍒", "🍇", "🍊", "🍓", "🍋", "🍉", 
                "🥭", "🍍", "🥝", "🥥", "🫐", "🍈", "🍐", "🍑", 
                "🍏", "🥑"]
        };
        
        // Initialize the game
        function initGame(gridSize=4) {
            // Reset game state
            clearInterval(timerInterval);
            gameBoard.innerHTML = '';
            cards = [];
            flippedCards = [];
            moves = 0;
            matches = 0;
            timer = 0;
            gameStarted = false;
            
            // Update UI
            movesDisplay.textContent = moves;
            matchesDisplay.textContent = matches;
            timerDisplay.textContent = `${timer}s`;
            
            // Set grid size
            currentGridSize = gridSize;
            totalPairs = gridSize === 4 ? 8 : 18;
            
            // Update active grid button
            if (gridSize === 4) {
                grid4Btn.classList.add('active');
                grid6Btn.classList.remove('active');
                gameBoard.className = 'game-board grid-4';
            } else {
                grid4Btn.classList.remove('active');
                grid6Btn.classList.add('active');
                gameBoard.className = 'game-board grid-6';
            }
            
            // Create card array with pairs
            let emojis = emojiSets[gridSize];
            let cardValues = [];
            
            // Create pairs
            for (let i=0; i<totalPairs; i++) {
                cardValues.push(emojis[i]);
                cardValues.push(emojis[i]);
            }
            
            // Shuffle the cards
            cardValues = shuffleArray(cardValues);
            
            // Create card elements
            for (let i = 0; i < cardValues.length; i++) {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.value = cardValues[i];
                card.dataset.index = i;
                
                const cardFront = document.createElement('div');
                cardFront.className = 'card-front';
                cardFront.textContent = cardValues[i];
                
                const cardBack = document.createElement('div');
                cardBack.className = 'card-back';
                const icon = document.createElement('i');
                icon.className = 'fas fa-question';
                cardBack.appendChild(icon);
                
                card.appendChild(cardFront);
                card.appendChild(cardBack);
                
                card.addEventListener('click', () => flipCard(card));
                gameBoard.appendChild(card);
                cards.push(card);
            }
            
            // Hide win message
            winMessage.style.display = 'none';
        }
        
        // Shuffle array using Fisher-Yates algorithm
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        // Flip a card
        function flipCard(card) {
            // Don't allow flipping if already flipped or matched
            if (card.classList.contains('flipped') || 
                card.classList.contains('matched') || 
                flippedCards.length >= 2) {
                return;
            }
            
            // Start timer on first card flip
            if (!gameStarted) {
                startTimer();
                gameStarted = true;
            }
            
            // Flip the card
            card.classList.add('flipped');
            flippedCards.push(card);
            
            // Check for match when two cards are flipped
            if (flippedCards.length === 2) {
                moves++;
                movesDisplay.textContent = moves;
                
                const card1 = flippedCards[0];
                const card2 = flippedCards[1];
                
                if (card1.dataset.value === card2.dataset.value) {
                    // Match found
                    setTimeout(() => {
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        flippedCards = [];
                        
                        matches++;
                        matchesDisplay.textContent = matches;
                        
                        // Check for win
                        if (matches === totalPairs) {
                            endGame();
                        }
                    }, 500);
                } else {
                    // No match - flip cards back after delay
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        flippedCards = [];
                    }, 1000);
                }
            }
        }
        
        // Start the game timer
        function startTimer() {
            timerInterval = setInterval(() => {
                timer++;
                timerDisplay.textContent = `${timer}s`;
            }, 1000);
        }
        
        // End the game and show win message
        function endGame() {
            clearInterval(timerInterval);
            
            // Update win stats
            finalMoves.textContent = moves;
            finalTime.textContent = timer;
            
            // Show win message with delay
            setTimeout(() => {
                winMessage.style.display = 'flex';
            }, 500);
        }
        
        // Event listeners for buttons
        grid4Btn.addEventListener('click', () => initGame(4));
        grid6Btn.addEventListener('click', () => initGame(6));
        newGameBtn.addEventListener('click', () => initGame(currentGridSize));
        playAgainBtn.addEventListener('click', () => initGame(currentGridSize));
        
        // Initialize the game with default grid size
        initGame(4);