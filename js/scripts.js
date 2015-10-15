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
    	}
  	});
});