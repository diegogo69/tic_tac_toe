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
    // Create board

    // Place marker (xy, marker)
        // Check if xy available
        // If available
            // xy = marker
        // Else
            // return false? keep asking for a valid xy

    // Display board
        // board string
        // for row x
            // for column y
                // board += marker
        // print board string


    // Check winner
        // Check row
        // Check column
        // Check Diagonal Down right / Down left
            // diagonal.downRight
            // diagonal.downLeft

        // if corner
        // elif midside
        // elif center
    // Check full board

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
