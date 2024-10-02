const log = console.log;

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



// Board Object: controls the board, data and functionality
const gameBoard = ( function() {
    
    // Rows and Columns constant values
    const BOARD_SIZE = 3;

    // Declare valid spot expression
    const validSpot = (x) => ( x >= 0 && x <= 2 );

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

    // Event triggered get the spot clicked
    function getClickCoordinates(event) {
        let yx = event.target.dataset.index;
        let [y, x] = [ (parseInt(yx[0])), (parseInt(yx[1])) ];
        if (validSpot(y) && validSpot(x)) {
            return [y, x]
        }
        return ;
    }
    // Get random coordinates use for computer turn
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
                let spot = gameDOM.spots[BOARD_SIZE * y + x];

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
        // Check if current spot is equal to next spot
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


// Play Game
const game = ( function() {
    let turn;
    let players;
    let modePvP;
    let result;
    let boardActive = false;

    // Setup Game
    function setupGame( { p1, p2, pvp } ) { 
        // Select players
        players = { p1, p2 };
        modePvP =  pvp;
        // Select turn
        // turn = Math.floor( Math.random() + 1 );
        turn = Math.round( Math.random() + 1 );

        // Make board
        gameBoard.defaultBoardArray();
        gameBoard.displayBoardArray();
        gameBoard.logBoardString();
        // If board spots has no event handlers yet
        if (!boardActive) {
             gameDOM.turnBoard();
             boardActive = true;
            }
        // If previous game played. reset result
        result = false;
        gameDOM.resultText.textContent = "";
    }

    // playTurn. Handles the logic of a single turn
    function playTurn( event = null ) {
        let marker;
        let x, y;

        // If event it's user triggered
        if (event) {
            marker = players[`p${turn}`].getMarker();            
            [y, x] = gameBoard.getClickCoordinates(event);
        }
        // If not event it's Computer triggered
        else {
            marker = "o";
            [y, x] = gameBoard.getRandomCoordinates();    
        }

        if ( !gameBoard.placeMarker( {marker, x, y} ) ) { return }

        gameBoard.displayBoardArray();
        gameBoard.logBoardString();

        // let result;
        if (gameBoard.checkWinner({x, y})) {
            if (!modePvP && turn == 1) {
                result = `You Win!!!!`;
            } else {
                result = `${players[`p${turn}`].getName()} Wins!!!!`;
            }
        }

        else if (gameBoard.checkTie()) {
            result = "Ohh, it's a TIE!!!";
        };

        turn = (turn == 1) ? 2 : 1;
        return result;      
    }

    // DOM 
    function spotEventHandler(event) {
        if (result) { return }
                
        result = game.playTurn( event );
    
        // If not win and Computer's turn
        if (!result && !modePvP) {
            result = game.playTurn();
        }
        // Inmediate computer turn
        if (result) {
            log(result);
            // alert(result);
            gameDOM.resultText.textContent = result;
        }
    }    
    
    return { setupGame, playTurn, spotEventHandler }
} )();

// Define DOM elements and event handlers
const gameDOM = ( function() {
    const resultText = document.querySelector(".result-wrapper");
    const grid = document.querySelector(".grid-container");
    const spots = grid.querySelectorAll(".spot");    

    const arrows = document.querySelectorAll('.arrow');
    for (let arrow of arrows) {
        arrow.addEventListener('click', event => {
            formPlayPvP.classList.toggle('hidden');
            formPlayPvC.classList.toggle('hidden');
        })
    }

    function turnBoard() {
        spots.forEach( (spot) => (
            spot.addEventListener('click', (event) => game.spotEventHandler(event))
        ) );
    }

    // Player vs Player DOM elements
    const btnPlayPvP = document.querySelector('#btnPlayPvP');
    const formPlayPvP = document.querySelector('#formPlayPvP');
    // Setup PvP
    btnPlayPvP.addEventListener('click', event => {

        event.preventDefault();

        // Get players name
        let p1Name = formPlayPvP.querySelector('#p1-name').value;
        let p2Name = formPlayPvP.querySelector('#p2-name').value;

        if (!p1Name) { p1Name = "Player 1" };
        if (!p2Name) { p2Name = "Player 2" };

        const p1 = createPlayer({ name: p1Name, marker: "x" });
        const p2 = createPlayer({ name: p2Name, marker: "o" });

        let pvp = true;

        game.setupGame( {p1, p2, pvp} );
        
    });

    // Player vs computer DOM elemens
    const btnPlayPvC = document.querySelector('#btnPlayPvC');
    const formPlayPvC = document.querySelector('#formPlayPvC');
    // Setup PvC
    btnPlayPvC.addEventListener('click', event => {

        event.preventDefault();

        const p1 = createPlayer({ name: "You", marker: "x" });
        const p2 = createPlayer({ name: "Computer", marker: "o" });

        let pvp = false;

        game.setupGame( {p1, p2, pvp} );
        
    });

    return {
        turnBoard, resultText, spots,
    }
} )()