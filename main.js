const log = console.log;
log("hello world");

let players;
const grid = document.querySelector(".grid-container");
const spots = grid.querySelectorAll(".spot");


// Board Object: controls the board, data and functionality
const gameBoard = ( function() {
    
    // Rows and Columns constant values
    const BOARD_SIZE = 3;

    // Game board array
    let boardArray = [];
    let spotsLeft = [];

    // Create boardArray
    function defaultBoardArray() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            boardArray[row] = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                boardArray[row][col] = null;
                spotsLeft.push(`${row}${col}`)
            }
        }
    }    

    // Get boardArray array
    function getBoardArray() {
        return boardArray;
    }

    // Parse board array into a string
    function getBoardString() {
        let boardString = "";
        for (let y = 0; y < BOARD_SIZE; y++) {
            // board[y] = [];
            for (let x = 0; x < BOARD_SIZE; x++) {
                boardString += boardArray[y][x];
                // board[row][x] = null;
                boardString += " "
            }
            // Jump line
            boardString += "\n";
        }
        return boardString;
    }

    // Log Board string
    function logBoardString() {
        console.log(getBoardString())
    }

    function getClickCoordinates(event) {
        let yx = event.target.dataset.index;
        return [ (parseInt(yx[0])), (parseInt(yx[1])) ];
    }

    function getRandomCoordinates() {
        let xyIndex = Math.floor( Math.random() * (spotsLeft.length - 1) );
        let yx = spotsLeft[xyIndex];
        return [ parseInt( yx[0] ), parseInt( yx[1] ) ];
    }

    // Display board string
    function displayBoardArray() {
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                // parse two dimensional index of boardArray to 1 dimensional index
                // BOARD_SIZE * 0 = 0 -> 0 + 0 | 0 + 1 | 0 + 2
                // BOARD_SIZE * 1 = 3 -> 3 + 0 | 3 + 1 | 3 + 2
                // BOARD_SIZE * 2 = 6 -> 6 + 0 | 6 + 1 | 6 + 2
                let spot = spots[BOARD_SIZE * y + x];

                spot.textContent = boardArray[y][x];
            }
        }
    }

    // Place marker (xy, marker)
    function placeMarker({marker, x, y}) {
        // Check if spot available
        if (!boardArray[y][x]) {
            boardArray[y][x] = marker;

            // Delete spot from spotsLeft array        
            let xyIndex = spotsLeft.indexOf(`${y}${x}`);
            spotsLeft.splice(xyIndex, 1);    

            // Spot available and marked
            return true;
        }
        // Spot not available, not marked
        return false;
    }

    function checkWinner({x, y}) {
        // current spot is equal to next spot
        const sucesiveSpots = (currentSpot, nextSpot) => (currentSpot !== null && currentSpot === nextSpot);
        // For each method in checkCross (row, colum, diagonal)
        for (let prop in checkCross) {
            let streak = 1;
            for (let i = 0; i < BOARD_SIZE -1; i++) {
                // Pass current iteration to check sucesive spots
                let [current, next] =  checkCross[prop]({x, y, i});
                if (!sucesiveSpots(current, next)) { break }
                streak += 1;
            }
            if (streak === 3) { 
                log(`Win by ${prop}`);
                return true
            }
        }
        log(`Not win`);
        return false
    }

    function checkTie() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (boardArray[row][col] === null) { return false };
            }
        }
        return true;
    }

    // Check winner
    checkCross = {
        // Check full row for 3 sucesive spots in a row
        row( {y, i} ) {
                let x = i;
                // return Current Spot and Next Spot
                return [boardArray[y][x], boardArray[y][x + 1]];
        },
    
        // Check full column for 3 sucesive spots in a row
        column( {x, i} ) {
            let y = i;
            // return Current Spot and Next Spot
            return [boardArray[y][x], boardArray[y + 1][x]];
        },
    
        // Check full column for 3 sucesive spots in a row
        diagonalDR({i}) {
            let xy = i;
            // return Current Spot and Next Spot
            return [boardArray[xy][xy], boardArray[xy + 1][xy + 1]];
        },
    
        // Check full column for 3 sucesive spots in a row
        diagonalDL({i}) {
            let y = i;
            let x = (BOARD_SIZE - 1) - y;
            // return Current Spot and Next Spot
            return [boardArray[y][x], boardArray[y + 1][x - 1]];
        },
    }

    return {
        defaultBoardArray, getBoardArray, getClickCoordinates,
        placeMarker, checkWinner, checkTie, getRandomCoordinates,
        displayBoardArray, logBoardString,
    }
} )();

// Player Object: contains the player data and functionality
function createPlayer({name, marker}) {

    // Marker
    function getMarker() {
        return marker;
    }

    // Name
    function getName() {
        return name;
    }
    
    return {getMarker, getName}   
};


// Play Game
const game = ( function() {
    let turn;
    // Setup Game
    function setupGame() { 
        // Select players
        players = selectPlayers();
        // Select turn
        turn = selectTurn()
        // Make board
        gameBoard.defaultBoardArray();
        gameBoard.displayBoardArray();
        gameBoard.logBoardString();
    }

    function selectPlayers() {
        // Select players name 
        let p1Name = prompt("P1 name: ");
        if (!p1Name) { p1Name = "Player 1" }
        let p2Name = prompt("P2 name: ");
        if (!p2Name) { p2Name = "Player 2" }
        
        // Select marker
        const marker = selectMarker();
        // Set markers
        const p1Marker = (marker == "1" || marker == "x") ? "x" : "o";
        const p2Marker = (marker == "1" || marker == "x") ? "o" : "x";
        
        const p1 = createPlayer({ name: p1Name, marker: p1Marker })
        const p2 = createPlayer({ name: p2Name, marker: p2Marker })
        return {p1, p2}
    }

    function selectMarker() {
        let marker;
        do {
            marker = prompt(
                `${"Player one"} choose a marker:\n
                1. x
                2. o`);
                if ( !marker ) { marker = "x" }
        } while ( !marker.match(/^[xo12]/i) );
        return marker
    }

    function selectTurn() {
        do {
            turn = prompt(
                `Who marks first? Enter an option (1 or 2)\n
                1. Player 1
                2. Player 2`);
            if ( !turn ) { turn = "1" }
        } while (turn != 1 && turn != 2);
        return turn;
    }

    function promptPlace() {
        // Declare spot variable (YX coordinates)
        let spot;
        // Declare valid spot expression
        const validSpot = (x) => ( x >= 0 && x <= 2 );
        do {
            spot = prompt(`Enter spot place in XY format (e.g 00): `);
        } while ( !(validSpot(spot[0]) && validSpot(spot[1])) );

        return [(parseInt(spot[0])), (parseInt(spot[1]))];
        }

    // Playround
    function playRound( event ) {
        let [y, x] = gameBoard.getClickCoordinates(event);
        let marker = players[`p${turn}`].getMarker();

        if ( !gameBoard.placeMarker( {marker, x, y} ) ) { return }

        gameBoard.displayBoardArray();
        gameBoard.logBoardString();


        let result;
        if (gameBoard.checkWinner({x, y})) {
            result = `${players[`p${turn}`].getName()} Wins!!!!`;
        }

        else if (gameBoard.checkTie()) {
            result = "Ohh, it's a TIE!!!";
        };

        turn = (turn == 1) ? 2 : 1;
        return result;      
    }

    // PlayRoundAI
    function playRoundAI() {
        marker = "o";
        let [y, x] = gameBoard.getRandomCoordinates();

        if ( !gameBoard.placeMarker( {marker, x, y} ) ) { return }

        gameBoard.displayBoardArray();
        gameBoard.logBoardString();

        let result;
        if (gameBoard.checkWinner({x, y})) {
            result = (turn == 1) ? "You win!" : "Computer Wins!"
        }

        else if (gameBoard.checkTie()) {
            result = "Ohh, it's a TIE!!!";
        };

        turn = (turn == 1) ? 2 : 1;
        return result;      
    }

    function playGame() {
        gameBoard.displayBoardArray();
        gameBoard.logBoardString();

        while (!result) {
            let marker =  (turn == 1) ? players.p1.getMarker() : players.p2.getMarker();
            // let y, x;
            let [y, x] = promptPlace();
            gameBoard.placeMarker( {marker, x, y} );
            gameBoard.logBoardString();

            if (gameBoard.checkWinner({x, y})) {
                log(`${players[`p${turn}`].getName()} Wins!!!!`);
                return;
            };

            if (gameBoard.checkTie()) {
                log("Ohh, it's a TIE!!!")
                return;
            };

            turn = (turn == 1) ? 2 : 1;
        }
        
    }
    
    return { setupGame, playGame, playRound, playRoundAI }
} )();


game.setupGame()
let result;
let modeAI;
// let modeAI = true;
spots.forEach((spot) => ( spot.addEventListener('click', (event) => {
    if (result) { return }
    
    result = game.playRound( event );

    // If not win and Computer's turn
    if (modeAI && !result) {
        result = game.playRoundAI();
    }
    // Inmediate computer turn
    if (result) {
        log(result);
        alert(result);
    }

    })
));