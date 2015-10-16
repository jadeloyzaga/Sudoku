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

$(document).ready(function() {
    $(".valueButton").click(function() {
        inputValue = $(this).text();
        
        $("#value").removeAttr("id");

        console.log("assigning " + inputValue);
        $(this).attr("ID", "value");
    });

    $(".delButton").click(function() {
        inputValue = '';
    });

    $(".editable").click(function() {
        //update the board
        board[$(this).attr("id")] = inputValue;
        // update the view
        $(this).text(inputValue);
        // console.log(board);
        if (inputValue == "") {
            $(this).removeClass("invalid");
        } else {
            isValid($(this));
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
                $(td).addClass ("non-editable");
                board.push(value);
            }
        }
    }
    // console.log(board);
    body.appendChild(table);
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

function isValid(cell) {
    var cellId = $(cell).attr("id");
    var valid = checkGrid(cellId) && checkRow(cellId) && checkCol(cellId);

    if (!valid) {
        $(cell).addClass("invalid");
    }
    if (valid) {
        $(cell).removeClass("invalid");
    }
};

// Checks to see if there is another cell in this row that has the same value in it
function checkRow(cellId) {
    var row = getRow(cellId);
    
    var valid = true;
    var cellVal = $(board)[cellId];

    for (i = 0; i < 9; i++) {
        var checkIndex = 9*row+i;
        var checkVal = board[checkIndex];

        if (getCol(cellId) == i) {
            continue;
        } else if (cellVal == checkVal) {
            // console.log("we have a match " + cellVal + " matches " + (checkIndex) + ":" + $(board)[checkIndex]);
            valid = false;
            break;
            highlightClash(checkVal);
        } else {
            // remove invalid class if it's there
            // $("#"+checkIndex).removeClass("invalid");
        }
    }
    return valid;
};

// Checks to see if there is another cell in this row that has the same value in it
function checkCol(cellId) {
    var col = getCol(cellId);
    
    var valid = true;
    var cellVal = $(board)[cellId];

    for (i = 0; i < 9; i++) {
        var checkIndex = 9*i+col;
        var checkVal = board[checkIndex];

        if (getRow(cellId) == i) {
            continue;
        } else if (cellVal == checkVal) {
            // console.log("we have a match " + cellVal + " matches " + checkIndex + ":" + $(board)[checkIndex]);
            valid = false;
            break;
            highlightClash(checkVal);
        } else {
            // remove invalid class if it's there
            // $("#"+checkIndex).removeClass("invalid");
        }
    }
    return valid;
}

function checkGrid(cellId) {
    var valid = true;
    var cellVal = $(board)[cellId];
    
    //work out which grid the cell lives in
    var grid = idToGridMap[cellId];
    // find the other ids that live in that grid
    var gridIds = gridToIdMap[grid];

    console.log("looking for ids " + gridIds);

    for (i = 0; i < 9; i++) {
        checkIndex = gridIds[i];
        var checkVal = board[checkIndex];

        if (cellId == checkIndex) {
            continue;
        } else if (cellVal == checkVal) {
            // console.log("we have a match " + cellVal + " matches " + checkIndex + ":" + $(board)[checkIndex]);
            valid = false;
            break;
            highlightClash(checkVal);
        } else {
            // remove invalid class if it's there
            // $("#"+checkIndex).removeClass("invalid");
        }
    }
    return valid;
}


