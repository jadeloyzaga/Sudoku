var SUDOKU_NUM_ROWS  = 9;
var SUDOKU_NUM_COLS  = 9;
var SUDOKU_NUM_GRIDS = 9;

/**
 * The initial board state - ideally pulled from the server
 */
var startGame = [
                  "5","3","",     "","7","",      "","","",
                  "6","","",      "1","9","5",    "","","",
                  "","9","8",     "","","",       "","6","",  

                  "8","","",      "","6","",      "","","3",  
                  "4","","",      "8","","3",     "","","1",  
                  "7","","",      "","2","",      "","","6",  
                
                  "","6","",      "","","",       "2","8","",
                  "","","",       "4","1","9",    "","","5",
                  "","","",       "","8","",      "","7","9"
                ];

/**
 * This initial board state can be used for testing the end-game
 * condition.
 */
// var startGame = [
//                    "5","3","4",     "6","7","8",      "9","1","2",
//                    "6","7","2",      "1","9","5",    "3","4","8",
//                    "1","9","8",     "3","4","2",       "5","6","7",  
 
//                    "8","5","9",      "7","6","1",      "4","2","3",  
//                    "4","2","6",      "8","5","3",     "7","9","1",  
//                    "7","1","3",      "9","2","4",      "8","5","6",  
                 
//                    "9","6","1",      "5","3","7",       "2","8","",
//                    "2","8","7",       "4","1","9",    "6","3","5",
//                    "3","4","5",       "2","8","6",      "1","7","9"
//                  ];

/**
 * Build a mapping from cell ID to grid within the puzzle
 *
 * Ideally, this would be provided by the server but for now
 * we'll just generate it here.
 */
var idToGridMap = [];
for (var row = 0; row < SUDOKU_NUM_ROWS; row++)
{
    var gridRow = Math.floor(row / 3);
    for (var col = 0; col < SUDOKU_NUM_COLS; col++)
    {
        var gridCol = Math.floor(col / 3);
        var cellID = SUDOKU_NUM_COLS*row + col;

        idToGridMap[cellID] = 3*gridRow + gridCol;
    }
}

/**
 * Build a mapping from grid ID to the cells
 * contained within that grid.
 *
 * We need this to be able to check for
 * duplicate values within a given grid.
 */
var gridToIdMap = [];
for (var grid = 0; grid < SUDOKU_NUM_GRIDS; grid++)
{
    gridToIdMap.push([]);
}
for (var i = 0; i < SUDOKU_NUM_COLS*SUDOKU_NUM_ROWS; i++)
{
    gridToIdMap[idToGridMap[i]].push(i);
}

var board = [];
var inputValue = '';
var filledCells = 0;

/**
 * For a given cell, whether or not it is currently marked
 * as invalid.
 *
 * We revisit this periodically to see if
 * an error in the puzzle has been fixed and thus it
 * may be marked as correct again.
 */
var invalidMap = {};

$(document).ready(function() {
    /**
     * Basic view logic to highlight which value
     * will be applied to the board
     */
    $(".valueButton").click(function() {
        inputValue = $(this).text();
        $("#inputValue").removeAttr("id");
        $(this).attr("ID", "inputValue");
    });

    /**
     * Adds the ability to clear existing values
     * from editable cells in the board
     */
    $("#clearButton").click(function() {
        if (inputValue != '') {
            inputValue = '';
        }
    });
    
    /**
     * Gives the view the ability to reset the board state
     */
    $("#resetButton").click(function() {
        /**
         * Rather than attempting to undo the user's actions,
         * it's easier to load the table again from scratch.
         */
        loadTable(startGame);
    });
});

/**
 * Attaches click events to editable cells in the puzzle board.
 */
function setupCellClickEvents()
{
    $(".editable").click(function() {
        var cellId = $(this).attr("id");
        if (inputValue == "" && board[cellId] != "" ) {
            // We are deleting a previously filled cell
            filledCells--;
        }

        // Update the board state with the new value
        board[cellId] = inputValue;

        // Update the view to to reflect the new board state
        $(this).text(inputValue);
        
        if (inputValue == "") {
            /**
             * When deleting a cell from the view, remove its invalid
             * class and remove it from the invalid map
             */
            $(this).removeClass("invalid");
            delete invalidMap[cellId];
        } else {
            filledCells++;
            // Verify whether the new move is valid
            checkMove(cellId);
        }
        /**
         * The new move may have fixed other previously
         * invalid cells i.e. clearing a clashing cell or
         * overriding the duplicate - let's check them again.
         */
        for (id in invalidMap) {
             checkMove(id);
        }
    });
}

function loadTable(game) {
    // Reset global state
    filledCells = 0;   
    invalidMap = {};
    board = [];

    // Create a table to populate with the puzzle
    var table  = document.createElement('table');
    table.border = "1";

    for (i = 0; i < SUDOKU_NUM_ROWS; i++) {
        var tr = table.insertRow();
        for (j = 0; j < SUDOKU_NUM_COLS; j++) {
            var index = i*SUDOKU_NUM_COLS+j;
            var value = $(game).get(index);
            var td = tr.insertCell();

            td.appendChild(document.createTextNode(value));
            td.id = index;
            if (value == "") {
                $(td).addClass ("editable");
            } else {
                filledCells++;
                $(td).addClass ("non-editable");
            }
            board[index] = value;
        }
    }

    // Populate the placeholder in the DOM with our table
    $("#puzzle").html(table);

    // Attach the on-click events
    setupCellClickEvents();
};
    
function displaySuccess() {
    for (id = 0; id < SUDOKU_NUM_ROWS*SUDOKU_NUM_COLS; id++) {
        $("#"+id).addClass("success");
    }
    $("#sucessText").html("<h2>Well Done!</h2>")
    console.log("YOU ARE AWESOME!!");
};

/**
 * Is passed the cell's id value to return which row the cell sits in
 * 0 - 8
 */
function getRow(cellId) {
    return Math.floor(cellId/SUDOKU_NUM_COLS);
};

/*
 * Is passed the cell's id value to return which col the cell sits in
 * 0 - 8
 */
function getCol(cellId) {
    return cellId%SUDOKU_NUM_COLS;
};

/**
 * Checks whether a move is valid and updates the view depending
 * on the outcome (invalid values are highlighted).
 */
function checkMove(cellId) {
    var valid = isValid(cellId);
    if (valid) {
        if (invalidMap[cellId] == true) {
            // The new move is valid but was previously invalid
            $("#"+cellId).removeClass("invalid");
            delete invalidMap[cellId];
            for (id in invalidMap) {
                if (id != cellId) {
                    checkMove(id);
                }
            }
        }

        // Once the board is full, check if we're done
        if (filledCells == 81 && jQuery.isEmptyObject(invalidMap)) {
            displaySuccess();
        }
    } else {
        // Invalid moves are highlighted
        $("#"+cellId).addClass("invalid");
        if (invalidMap[cellId] != true) {        
            invalidMap[cellId] = true;
        }
    }
}

function isValid(cellId) {
    return checkGrid(cellId) && checkRow(cellId) && checkCol(cellId);
}

function doCellsMatch(a, b) {
    var same = false;
    if (a != b ){
        if (board[a] == board[b]) {
            same = true;
        }
    }
    return same;
}

// Checks to see if there is another cell in this row that has the same value in it
function checkRow(cellId) {
    var row = getRow(cellId);
    var valid = true;

    for (i = 0; i < 9; i++) {
        var checkIndex = 9*row+i;
        if (doCellsMatch(cellId, checkIndex)) {
            // the two cells contain the same value
            valid = false;
            break;
        }
    }    
    return valid;
};

// Checks to see if there is another cell in this row that has the same value in it
function checkCol(cellId) {
    var col = getCol(cellId);
    var valid = true;

    for (i = 0; i < 9; i++) {
        var checkIndex = 9*i+col;
        if (doCellsMatch(cellId, checkIndex)) {
            // the two cells contain the same value
            valid = false;
            break;
        }
    }
    return valid;
}

function checkGrid(cellId) {
    var valid = true;    
    //work out which grid the cell lives in
    var grid = idToGridMap[cellId];
    // find the other ids that live in that grid
    var gridIds = gridToIdMap[grid];

    for (i = 0; i < 9; i++) {
        var checkIndex = gridIds[i];
        if (doCellsMatch(cellId, checkIndex)) {
            // the two cells contain the same value
            valid = false;
            break;
        }
    }
    return valid;
}
