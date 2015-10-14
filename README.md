# Sudoku

10/14 - Thinking about user input

Simple interface is done, but now we have to consider how to implement adding the user's input.

Buttons vs Text Fields
Buttons:
- Will need a way to select which cell you want to add a number into, not everyone will approach a sudoku one direction, but rather they will jump around the grid filling in the easiest to dirtermin cells and eliminating the possibilities for the harder ones
- Buttons will also allow a place to show non-valid options, as that button could be disabled from the user.

Text field:
- Quicker to type in the answer rather then clicking around with the mouse.
- Will have to consider how it looks on mobile vs tablets vs web since it hides part of the screen and may obscure the rest of the sudoku.
- input checking, only accept number 1 - 9.

The best solution would be a combination of the two, but i feel like for this example, time effective solutions will win out.

10/13 - Initial thoughts and plans

Time frame : 3 Days (Let's get this in by Friday)

UI
- Need to be able to differentiate between rows, cols, and 3x3 grids
  - Can be done with lines, different background colours
  - Helps with visualisation and eliminate wrong input
- Need to be able to differentiate between what user enters vs pre gen
  - Can be done with greyed out colour, different colours, or font weight
  - Eliminates confusion, easier to correct mistake
- Helps with number selection
  - Eliminates/highlights impossible numbers if it already exsists in row, col or 3x3 grid.
  - Makes the selection of numbers better, there for faster and more likely for the user to make a correct choice and find errors sooner

Entering Numbers
- Should be able to overwrite
- Should be able to undo
- Should be able to be done via different input, ie button, typing, others?

Solver vs checker
For a solver, the sudoku could be checking the solution every entry to see if it is correct or it could check the board vs the solution once it has been completely filled. 
  - By checking every entry against the correct entry this could be used by a user to brute force the answer, without them trying to solve the sudoku with the rules.
  - By checking at the end, once the board has been completed if the solution is incorrect, there is no way for the user to know where they went wrong, they would just have to reset the board. 
A checker wouldn't hold this extra information, but rather just check after a user fills in a space to see if it meets all the requirements of sudoku, (no repetition of the number in it's row, col, or 3x3 grid). It's safe to assume that if the grid has been filled and there are no invalid moves then the solution is correct.
  - This is good for sudoku's that might have more then 1 valid solution.
  - Doesn't allow the user to use the program to solve the sudoku, just their fuzzy logic.
  - 

