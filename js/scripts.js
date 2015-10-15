var startGame = [
				"5","3","",		"","7","",		"","","",
				"6","","",		"1","9","5",	"","","",
				"","9","8",		"","","",		"","6","",	

				"8","","",		"","6","",		"","","3",	
				"4","","",		"8","","3",		"","","1",	
				"7","","",		"","2","",		"","","6",	
				
				"","6","",		"","","",		"2","8","",
				"","","",		"4","1","9",	"","","5",
				"","","",		"","8","",		"","7","9"
				]


var inputValue = '';

$(document).ready(function() {


    $(".valueButton").click(function() {
        inputValue = $(this).text();
    	console.log("assigning " + inputValue);
    });

  	$(".editable").click(function() {
    	if (inputValue == '') {
    		console.log("select a number to add to this cell");
    	} else {
    		

    		$(this).text(inputValue);
    		// alert("row is " + allInRow(this));
    	}
  	});
});

function loadTable(game) {
	var body = document.body,
        table  = document.createElement('table');
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
			} else {
				$(td).addClass ("non-editable");
			}
		}
	}
	body.appendChild(table);
}



function getRow(x) {
	return Math.floor(x.id/9);
};

function getCol(y) {
	return y.id%9;
};

function allInRow(x) {
	row = getRow(x);
	// val = [];

	for(i = 0; i < 9; i++) {
		console.log(document.getElementById(row*9+i).value);
	}
	// alert(val);
}