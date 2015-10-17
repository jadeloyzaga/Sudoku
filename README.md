# Sudoku
========

How To Play
-----------

On your game board there are a mixture of greyed out numbers and blank spaces. The greyed out numbers are non editable, and will provide clues to solving your Sudoku.

Fill in a space by choosing a selector tile, valued from 1 to 9 and then selecting that cell. You can fill multiple cells with the same number just by clicking multiple tiles. 

To choose a new number to fill in with, select it's corrisponding Selector tile.
To clear a space, select the clear tile.

As you fill in the grid, some tiles may turn red (but hopefully not), this means that you have entered an invalid move based on the rules of sudoku. Each number must be unique from 1 to 9 in a row, a colloum and a 3x3 grid. We will let you continue with this error, but the board will need to be correct to succeed.

Simple Rules:
-------------

1. Select number tile
2. Click on grid to fill with number.
3. Red is bad, best to avoid red by clearing with clear button, or just being awesome.


Design Decisions and their impact.
----------------------------------

### Input methods:

Thought and tried lots of different sudoku's and found that most were getting user input by, key strokes, button selection, drag and drop, clicking on the grid then clicking the number or some other strange combination of these. 

Elected to stick with a value selector bar since it would be easier to have a consistant style between web vs mobile vs tablet. If I was progressing with the game, I would allow for text input for desktop to allow users to decide on their own best way to play, but considered that it would obscure too much of the screen on mobile.

### Highlighing invalid moves, but not giving away the answer:

Considered the different ways to verify solutions to the sudoku. A cheats way would be to have the start grid and a solved grid to check against. the question to this method become how frequently do you check it. if it's too often, ie after every user input, the player can just brute force the answer, not frequent enough and there's no way for the user to know where they went wrong - and that's not very helpful.

Elected to go with a method that would just check to see if the user's change to a cell was considered a valid move or invalid, and highlight this state after every change in their board state. Although it won't tell you if it is correct, it's safe to assume that at the end if there are no in valid moves, then the whole board is valid. This is especially good if you consider some sudoku's are written to have more then one solution.

There were other less impactful decisions that were made throughout this journey, they're presented in more of a journal style below in the *journal*

The "If I had more time" list
-----------------------------
- key board input on all devices, with some thought on how that would have to change on mobile
- could eliminate values from the Number Selector Bar, if:
  - The number occurs the maximum number of times in the Sudoku
  - It is an invalid move in this cell.... but these just make the game less challenging
- bring in new puzzles from the server. because I already know the asnwer to this one.
- have the game be of varying sizes:
  - have a set up game function which would retrieve:
    - number set (eg, [1,2,3,4,5,6,7,8,9,a,b,c,d,e,f] for hexidecimal sudoku).
    - grid mapping
      - id to small grid(s), grid(s) since some ids may be a part of more then one small grid.
      - grid to id
    - Number of cells to be filled (although it could probably work this out with drawing board);
    - if really crazy, some sort of template for drawing the html properly. (samurai sudoku).
    - etc.
- More test cases. Most of the tests were simple enough to carry out by hand. Things like:
  - finding invalid matches in a row, col or 3x3 grid.
  - clearing a space of it's value - this should reset that space's class, and bring the filledIn count down.
  - filling in a cell with an invalid move, and then filling the same number in a valid space, but it clashes with the first cell. Then deleting the first cell should turn the second one into a valid space. etc.
- Unit tests, especially if we're going to add any more functions. 
- Refactor, where did my mvc go.. I had this great plan and that went out the window as I started hacking things together and wildly added features.
- Optimizations: because there's always a better, faster and smarter way to do things, although I've tried to be smart with the data types I've picked and when I use them, most of this was coded with a slightly jetlagged frame of mind. :)

But, step one would be unit tests, followed closely by refactor, then add in some more features. Rinse, repeat.

Journal
-------
### 10/15 - Approaching the 3x3 grid

So the "valid in row" and "valid in col" helper functions are up and running, but now we have to tackle checking if the move is valid in it's little self contained 3x3 grid.

My says to use Maps, evey ID points to which grid they live in
- 0 to 8 -> grid 0 
- 9 to 17 -> grid 1 
- 18 to 26 -> grid 3, etc.

and then another map to point out all the ID's in a grid
- 0 -> [0 - 8]
- 0 -> [9 - 17]
- 0 -> [18 - 26], etc

It will make this look up process faster.

### 10/14 - Thinking about user input

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

### 10/13 - Initial thoughts and plans

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

Oh goodness you actually read all that.. Cheers! 
- Jade
