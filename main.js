const log = console.log;
log("hello world");

// Play Game
const game = ( function() {
    let turn;
    let players;
    // Setup Game
    function setupGame() { 
        // Select players
        players = selectPlayers();
        // Select turn
        turn = selectTurn()
        // Make board
        gameBoard.defaultBoardArray();
    }

    function selectPlayers() {
        // Select players name 
        const p1Name = prompt("P1 name: ");
        const p2Name = prompt("P2 name: ");
        
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
                2. o`).toLowerCase();
        } while (marker != "1" && marker != "2" && marker != "o" && marker != "x");
        return marker
    }

    function selectTurn() {
        do {
            turn = prompt(
                `Who marks first? Enter an option (1 or 2)\n
                1. Player 1
                2. Player 2`).toLowerCase();
        } while (turn != 1 && turn != 2);
        return `p${turn}`;
    }

    function promptPlace() {
        // Declare spot variable (YX coordinates)
        let spot;
        // Declare valid spot expression
        const validSpot = (spot) => ( spot >= 0 && spot <= 2 );
        do {
            spot = prompt(`Enter spot place in XY format (e.g 00): `);
        } while (!validSpot(spot[0]) && !validSpot(spot[1]));

        return [(parseInt(spot[0])), (parseInt(spot[1]))];
        }

    // Playround
    function playGame() {
        while (true) {
            gameBoard.logBoardString();
            let marker =  (turn == "p1") ? players.p1.getMarker() : players.p2.getMarker();
            // let y, x;
            let [y, x] = promptPlace();
            gameBoard.placeMarker( {marker, x, y} );

            if (gameBoard.checkWinner({x, y})) {
                log(`${players[turn].getName()} Wins!!!!`);
                return;
            };

            if (gameBoard.checkTie()) {
                log("Ohh, it's a TIE!!!")
                return;
            };

            turn = (turn == "p1") ? "p2" : "p1";
        }
    }
    
    return { setupGame, playGame }
} )();

// Board Object: controls the board, data and functionality
const gameBoard = ( function() {
    
    // Rows and Columns constant values
    const BOARD_SIZE = 3;

    // Game board array
    let boardArray = [];

    // Create boardArray
    function defaultBoardArray() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            boardArray[row] = [];
            for (let col = 0; col < BOARD_SIZE; col++) {
                boardArray[row][col] = null;
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

    // Display Board string
    function logBoardString() {
        console.log(getBoardString())
    }

    // Place marker (xy, marker)
    function placeMarker({marker, x, y}) {
        // Check if spot available
        if (boardArray[y][x] === null) {
            boardArray[y][x] = marker;
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
        defaultBoardArray, getBoardArray, logBoardString,
        placeMarker, checkWinner, checkTie,
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
}

let players;
game.setupGame();
game.playGame();