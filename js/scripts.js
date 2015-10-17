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

// var startGame = [
//                   "5","3","4",     "6","7","8",      "9","1","2",
//                   "6","7","2",      "1","9","5",    "3","4","8",
//                   "1","9","8",     "3","4","2",       "5","6","7",  

//                   "8","5","9",      "7","6","1",      "4","2","3",  
//                   "4","2","6",      "8","5","3",     "7","9","1",  
//                   "7","1","3",      "9","2","4",      "8","5","6",  
                
//                   "9","6","1",      "5","3","7",       "2","8","",
//                   "2","8","7",       "4","1","9",    "6","3","5",
//                   "3","4","5",       "2","8","6",      "1","7","9"
//                 ];

var idToGridMap = [ 0, 0, 0,  1, 1, 1,  2, 2, 2, 
                    0, 0, 0,  1, 1, 1,  2, 2, 2, 
                    0, 0, 0,  1, 1, 1,  2, 2, 2, 

                    3, 3, 3,  4, 4, 4,  5, 5, 5, 
                    3, 3, 3,  4, 4, 4,  5, 5, 5, 
                    3, 3, 3,  4, 4, 4,  5, 5, 5, 

                    6, 6, 6,  7, 7, 7,  8, 8, 8,                     
                    6, 6, 6,  7, 7, 7,  8, 8, 8,                     
                    6, 6, 6,  7, 7, 7,  8, 8, 8 
                  ];
       
var gridToIdMap = [ [0,1,2,9,10,11,18,19,20],       // grid 0
                    [3,4,5,12,13,14,21,22,23],      // grid 1
                    [6,7,8,15,16,17,24,25,26],      // grid 2
                    [27,28,29,36,37,38,45,46,47],   // grid 3
                    [30,31,32,39,40,41,48,49,50],   // grid 4
                    [33,34,35,42,43,44,51,52,53],   // grid 5
                    [54,55,56,63,64,65,72,73,74],   // grid 6
                    [57,58,59,66,67,68,75,76,77],   // grid 7
                    [60,61,62,69,70,71,78,79,80]    // grid 8
                  ];

var board = [];
var inputValue = '';
var filledCells = 0;

// for searching for valid/invalid moves
var invalidMap = {};

$(document).ready(function() {
    $(".valueButton").click(function() {
        inputValue = $(this).text();
        $("#value").removeAttr("id");
        $(this).attr("ID", "value");
    });

    $("#clearButton").click(function() {
        if (inputValue != '') {
            inputValue = '';
        }
    });
    
    //TODO: This should really be an ID
    $(".resetButton").click(function() {
        console.log("RESET!!");
        // board = JSON.parse(JSON.stringify(startGame)); //yuck
        for (i = 0; i < 81; i++) {
            value = startGame[i];
            if (value == '') {
                // we're resetting this cell to empty
                filledCells--;
                // should call isvalid on things in the invalid stack
                for (id in invalidMap) {
                    checkMove(id);
                }
            }
            board[i] = value;
            $("#"+i).text(value);
            $("#"+i).removeClass("invalid");
            $("#"+i).removeClass("success");   
            for (id in invalidMap) {
                delete invalidMap[id];
            }            
        }
    });
    
    $(".editable").click(function() {
        var cellId = $(this).attr("id");
        if (inputValue == "" && board[cellId] != "" ) {
            // We're deleting.
            filledCells--;
        }
        //update the board
        board[cellId] = inputValue;
        // update the view
        $(this).text(inputValue);
        
        // console.log(board);
        if (inputValue == "") {
            for (id in invalidMap) {
                 checkMove(id);
            }
            $(this).removeClass("invalid");
            delete invalidMap[cellId];
            console.log("removed " + cellId + " to invalidMap: ");
            console.log(invalidMap);
        } else {
            checkMove(cellId);
            filledCells++;
        }
    });
});

function loadTable(game) {
    var body = document.body;
    var table  = document.createElement('table');
    table.border = "1";

    for (i = 0; i < 9; i++) {
        var tr = table.insertRow();
        for (j = 0; j < 9; j++) {
            var index = i*9+j;
            var value = $(game).get(index);
            var td = tr.insertCell();

            td.appendChild(document.createTextNode(value));
            td.id = index;
            if (value == "") {
                $(td).addClass ("editable");
                board.push(value);              
            } else {
                filledCells++;
                // console.log("filledCells = "+ filledCells);
                $(td).addClass ("non-editable");
                board.push(value);
            }
        }
    }
    if (filledCells == 81) {
        checkIfComplete(table);
    }
    // console.log(board);
    body.appendChild(table);
};
    
function checkIfComplete() {
    for (id = 0; id < 81; id++) {
        $("#"+id).addClass("success");
    }
    console.log("YOU ARE AWESOME!!");
};

// Is passed the cell's id value to return which row the cell sits in
// 0 - 8
function getRow(x) {
    return Math.floor(x/9);
};

// is passed the cell's id value to return which col the cell sits in
// 0 - 8
function getCol(y) {
    return y%9;
};

function checkMove(cellId) {
    var valid = isValid(cellId);
    if (valid) {
        if (invalidMap[cellId] == true) {
            $("#"+cellId).removeClass("invalid");
            
            console.log("removed " + cellId + " to invalidMap: ");
            console.log(invalidMap);

            delete invalidMap[cellId];
            
            for (id in invalidMap) {
                if (id != cellId) {
                    checkMove(id);
                }
            }
        }
        if (filledCells == 81 && jQuery.isEmptyObject(invalidMap)) {
            checkIfComplete();
        }
    } else {
        $("#"+cellId).addClass("invalid");
        if (invalidMap[cellId] != true) {        
            invalidMap[cellId] = true;
            console.log("added " + cellId + " to invalidMap: ");
            console.log(invalidMap);
        }
    }
}

function isValid(cellId) {
    var valid = checkGrid(cellId) && checkRow(cellId) && checkCol(cellId); // potential bug in ordering
    return valid;
};

function doCellsMatch(a, b) {
    var same = false;
    if (a != b ){
        if (board[a] == board[b]) {
            same = true;
        }
    }
    return same;
};


function checkLine(cellId, stride) {
    // var row = getRow(cellId);
    var cellVal = $(board)[cellId];
    var valid = true;

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
            // add this cell to a invalid stack, to be checked after every button click.
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
            // add this cell to a invalid stack, to be checked after every button click.
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
            // add this cell to a invalid stack, to be checked after every button click.
            break;
        }
    }
    return valid;
}


