# tic_tac_toe
Tic Tac Toe project as part of The Odin Projet curriculum

# Goal
Apply good conventions on organizing code using factory functions and structure code following the module pattern.

# Organizing code
For this project I wanted to make my program modular, so each piece of functionality is independent and with as little side effects as possible, making the readable and semantic.

## Factory functions
Factory functions were use for the player objects, keeping their variables private and providing simple access get methds
 
### `createPlayer`
Defines a player with a name and a marker, keeping this values privates and returning and object with methods to access these values.

## IIFE
IIFE were used for single intance modules, keeping code organized and establishing separation of concerns

### `gameBoard`
Defines code and functionality related directly with the boar. The module contains variables for the board size, and defining valid index (YX coordinates), and the board itself wich is stored in a two dimensional array. Also a `spotsLeft` array is declared, wich is used in the Player vs Computer mode, for the computer to pick and available spot.

#### `defaultBoardArray`
Defines the board array to a default state, all spots are empty, and updates the spotsLeft array to set all spots as available.

#### `getClickCoordinates`
It defines a valid YX coordinate values based on the spot clicked by the user. Each HTML spot cell element has a data value that represents the index of the spot. It parsed this value as a valid `y` and x `x` indeces values.

#### `getRandomCoordinates`
Defines the coordinates for a random available spot from the spotsLeft array, wich is used for the Player vs Computer mode in the computer's turn.

#### `displayBoardArray`
Updates the DOM board, with the current board array values

#### `placeMarker`
Updates the board array as it sets a spot value to a marker

#### `checkWinner`
Receives the coordinates of a spot, in this case the most recently placed one, and checks for a cross-out in the different combinations possibles, iterating on the defined methods in the checkCross object.

#### `checkTie`
Checks for a full board, if all of the spots in the boardArray are placed, and none is left empty.

#### `checkCross`
Define methods for the different possible combinations for a cross out, being both diagonals, a determined column or a determined row. In the case of row and column methods they receive an iterator `i` value, wich represents the current spot being check (one out of 3) and for columns an `x` value wich represent the column being check, and for rows an `y` value wich represents the row being check. The iterator represents the other index: X in the case of rows; Y in the case of columns.

### `game`
Contains data and functionality related to the general flow of the game. Like the current turn, current players, game mode and if there's a final result to finish the game

#### `setupGame`
Receives two player objects and the game mode, being player vs player or player vs computer. It then sets the board array as default, display it, and sets the DOM event handlers if they haven't been set yet, also resets the result value a result DOM display element

#### `playTurn`
Handles the play of a single turn, using the current turn player's marker, and checking if there's a win or tie after the marker has been placed, updates the game board and changes turn.

#### `spotEventHandler`
Defines the event handler function for every to execute when clicked. This playing the turn for the current turn, check for result, and if the game mode is Player vs Computer it plays the computer turn, otherwise it changes the turn for the other player to player his.

### `gameDOM`
Handles the DOM references and event listeners. There are two forms, one for each game mode and one is hidden while the other is displayed, the arrow elements toggle this functionality to change from different game modes. Clicking the play button creates 2 player instances and setup the game.