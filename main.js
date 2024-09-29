const log = console.log;
log("hello world");

// Play Game
    // Setup Game
        // Select player
        // Select turn
        // Make board

    // Playround

// Game Object: controls flow of the game
    // While true
        // If turn = 0
            // Player 1 place marker
        // else if turn 1
            // Player 2 place marker

        // Check winner
        // If winner
            // Declare winner

        // Check full board
        // If fullboard
            // Declare tie
        
        // Change turn
    // Clear board. Finish game

// Board Object: controls the board, data and functionality
const gameBoard = ( function() {
    
    // Rows and Columns constant values
    const BOARD_SIZE = 3;
    const CROSS = 3;

    // Game board array
    let boardArray = [];

    // Create boardArray
    function createBoardArray() {
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
        if (boardArray[y][x] === null) {return false}

        for (let prop in checkCross) {
            if (checkCross[prop]({x, y})) {
                log(`Win by ${prop}`);
                return true }
        }
        log(`Not win`);
        return false
    }

    // Check winner
    checkCross = {
        row( {y} ) {
            // Check full row for 3 sucesive spots in a row
            for (let spot = 0; spot < BOARD_SIZE - 1; spot++) {
                // current spot is equal to next spot
                let sucesiveSpots = (boardArray[y][spot] === boardArray[y][spot + 1]);
                // if not sucesive spots return false
                if (!sucesiveSpots) { return false }
            }
            // Up this point means 3 in a row
            return true;
        },
    
        column( {x} ) {
            // Check full column for 3 sucesive spots in a row
            for (let spot = 0; spot < BOARD_SIZE - 1; spot++) {
                // current spot is equal to next spot
                let sucesiveSpots = (boardArray[spot][x] === boardArray[spot + 1][x]);
                // if not sucesive spots return false
                if (!sucesiveSpots) { return false }
            }
            // Up this point means 3 in a row
            return true;
        },
    
        diagonalDR() {
            // Check full column for 3 sucesive spots in a row
            for (let spot = 0; spot < BOARD_SIZE - 1; spot++) {
                // current spot is equal to next spot
                let sucesiveSpots = (boardArray[spot][spot] === boardArray[spot + 1][spot + 1]);
                // if not sucesive spots return false
                if (!sucesiveSpots) { return false }
            }
            // Up this point means 3 in a row
            return true;
        },
    
        diagonalDL() {
            // Check full column for 3 sucesive spots in a row
            for (let spot = 0; spot < BOARD_SIZE; spot++) {
                let x = (BOARD_SIZE - 1) - spot;
                // current spot is equal to next spot
                let sucesiveSpots = (boardArray[spot][x] === boardArray[spot + 1][x - 1]);
                // if not sucesive spots return false
                if (!sucesiveSpots) { return false }
            }
            // Up this point means 3 in a row
            return true;
        },
    }

    return {
        createBoardArray, getBoardArray, logBoardString,
        placeMarker, checkWinner,
    }
} )();

// Player Object: contains the player data and functionality
function createPlayer({name, marker}) {
    // const marker = marker;
    // const name = name;

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

const diego = createPlayer({marker: "x", name: "diego"});
const ana = createPlayer({name: "ana", marker: "o"});

gameBoard.getBoardArray();
gameBoard.createBoardArray();
gameBoard.getBoardArray();

// gameBoard.logBoardString();
// gameBoard.placeMarker({marker: "a", x: 1, y: 1,});
// gameBoard.logBoardString();

// gameBoard.placeMarker({marker: "o", x: 0, y: 0,});
// gameBoard.placeMarker({marker: "x", x: 2, y: 2,});
// gameBoard.logBoardString();
// log(gameBoard.checkWinner({x: 1, y: 1 }))

gameBoard.placeMarker({marker: "x", x: 1, y: 1,});
gameBoard.placeMarker({marker: "x", x: 0, y: 0,});
// gameBoard.placeMarker({marker: "x", x: 2, y: 2,});
gameBoard.logBoardString();
log(gameBoard.checkWinner({x: 1, y: 1 }))