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
                ]

var board = [];
var inputValue = '';

$(document).ready(function() {


    $(".valueButton").click(function() {
        inputValue = $(this).text();
        
        $("#value").removeAttr("id");

        console.log("assigning " + inputValue);
        $(this).attr("ID", "value");
    });

    $(".editable").click(function() {
        if (inputValue == '') {
            console.log("select a number to add to this cell");
        } else {


            board[$(this).attr("id")] = inputValue;
            $(this).text(inputValue);
            console.log(board);
            isValid($(this));
            // alert("row is " + allInRow(this));
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
    var valid = checkRow(cellId) && checkCol(cellId);


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
        var checkVal = board[9*row+i];

        if (getCol(cellId) == i) {
            continue;
        } else if (cellVal == checkVal) {
            console.log("we have a match " + cellVal + " matches " + (9*row+i) + ":" + $(board)[9*row+i]);
            valid = false;
            break;
            highlightClash(checkVal);
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
        var checkVal = board[9*i+col];

        if (getRow(cellId) == i) {
            continue;
        } else if (cellVal == checkVal) {
            console.log("we have a match " + cellVal + " matches " + (9*i+col) + ":" + $(board)[9*i+col]);
            valid = false;
            break;
            highlightClash(checkVal);
        }
    }
    return valid;
}


