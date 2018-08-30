document.addEventListener('DOMContentLoaded', function() {
  
  let log = "";
  let boardlog = "";
  let check = "";
  
  let board = [];
  let clues = [];
  let currentRow = 0;
  let currentCol = 0;
  
  let puzzle1 =  `2__8__6__  
                  _18__5__9
                  ____4__5_
                  _8__3____
                  __1_7_2__
                  ____5__7_
                  _9__6____
                  4__5__92_
                  __5__2__3`;
  
  let solved1 =  `254893617
                  618725349
                  937146852
                  786231594
                  541679238
                  329458176
                  192364785
                  463587921
                  875912463`;
  
  /* Zeroes the sudoku board.
  */
  function clearBoard() {
    for (var i=0;i<9;i++) {
      board[i] = [];
      clues[i] = [];
      for (var j=0;j<9;j++) {
        board[i][j] = 0;
        clues[i][j] = 0;
      }
    }
  }
  clearBoard();
  
  /* Sets the board values based on an input string.
  */
  function setBoard(input) {
    input = input.replace(/\s/g, "");
    var x = 0;
    for (var i=0;i<9;i++) {
      for (var j=0;j<9;j++) {
        board[i][j] = (input[x] == "_") ? 0 : input[x];
        clues[i][j] = (input[x] == "_") ? 0 : input[x];
        x++;
      }
    }
  }
  
  /* Converts the stored board data to a string. 
  */
  function boardToString(brd) {
    let str = "";
    for (var i=0;i<9;i++) {
      for (var j=0;j<9;j++) {
        str += (brd[i][j] == 0) ? 0 : brd[i][j];
      }
      str += " ";
    }
    return str;
  }
  
  // set attributes
  $(".cell-input").attr("oninput","this.value = this.value.replace(/[^1-9]/g, '').replace(/(\..*)\./g, '$1');");
  $(".cell-input").attr("maxlength", "1");
  $("input").prop('readonly', false);
  
// NUMBERS

  $('.cell-input').on('focus', function() {
    let classes = this.className.split(" ");
    currentRow = parseInt(classes[2][1]);
    currentCol = parseInt(classes[3][1]);
    currentBox = parseInt(classes[4][1]);
    updateBoard();
    boardlog = "RCB: " + currentRow + ", " + currentCol + ", " + currentBox;
    check = checkCell(board, currentRow-1, currentCol-1) ? "good" : "bad";
    $("#log").html(boardlog + "<br/>" + boardToString(board) + "<br/>" + check);
  });
  
  $('.cell-input').keyup(function() {
    updateBoard();
    boardlog = "RCB: " + currentRow + ", " + currentCol + ", " + currentBox;
    check = checkCell(board, currentRow-1, currentCol-1) ? "good" : "bad";
    $("#log").html(boardlog + "<br/>" + boardToString(board) + "<br/>" + check);
  });
  
// OPERATORS
  
  $('#set').on('click', function() {
    setBoard(puzzle1);
    printBoard(board);
  });
  $('#check-cell').on('click', function() {
    checkBoard(board);
  });
  $('#board-clear').on('click', function() {
    $("input").prop('readonly', false);
    $('input').val("");
    updateBoard();
  });
  $('#submit').on('click', function() {
    if (checkBoard(board)) solveBoard(board,0,0); 
    else $("#log").text("UNSOLVABLE");
  });

// LOG
  
  $('#lock').on('click', function() {
    $(this).toggleClass("active");
    $(this).attr('aria-pressed', $(this).attr("aria-pressed") == "true" ? "false" : "true");
    $(this).text($(this).text() == "Unlock" ? "Lock" : "Unlock");
    $(".cell-input").filter((index,element) => element.value != "").attr('readonly', function(_, attr){ return !attr});
  });
  
  $('#log').hide();
  $('#logview').on('click', function() {
    $(this).toggleClass("active");
    $(this).attr('aria-pressed', $(this).attr("aria-pressed") == "true" ? "false" : "true");
    $(this).text($(this).text() == "Show Log" ? "Hide Log" : "Show Log");
    $('#log').toggle();
  });
  
  $('#logclear').on('click', function() {
    log = "";
    $('#log').text(log);
  });
  
// FUNCTIONS
  
  /* Updates the array holding the sudoku board data to match the input data. 
  */
  function updateBoard() {
    for (var i=0;i<9;i++) {
      for (var j=0;j<9;j++) {
        let value = document.getElementsByClassName("sudoku-row")[i].children[j].firstChild.value;
        board[i][j] = (value == 0) ? 0 : value;
      }
    }
  }
  
  /* Updates input values to match the sudoku board array.
  */
  function printBoard(brd) {
    for (var i=0;i<9;i++) {
      for (var j=0;j<9;j++) {
        let value = brd[i][j];
        document.getElementsByClassName("sudoku-row")[i].children[j].firstChild.value = (value == 0) ? "" : value;
      }
    }
  }
  
  /* Focuses the input at the current row and column. 
  */
  function ChangeCurrentCell() {
        let tableRow = document.getElementsByClassName("sudoku-row")[currentRow - 1];
        let tableCell = tableRow.children[currentCol - 1].firstChild;
        tableCell.focus();
  }

  /* Checks if a cell has the same value as any cell in the same column, row, or box.
   */
  function checkCell(brd, r, c) {
    if (brd[r][c] == 0) {
      return true;
    }
    for (let ci=0;ci<9;ci++) {  // check same row
      if (brd[r][ci] == brd[r][c] && ci != c) {
        //$('#log').html(log += "row");
        return false;
      }
    }
    for (let ri=0;ri<9;ri++) {  // check same column
      if (brd[ri][c] == brd[r][c] && ri != r) {
        //$('#log').html(log += "col");
        return false;
      }
    }
    for (let br=r-r%3;br<r+3-r%3;br++) {  // check same box
      for (let bc=c-c%3;bc<c+3-c%3;bc++) { 
        if (brd[br][bc] == brd[r][c] && br != r && bc != c) {
          //$('#log').html(log += "box");
          return false;
        }
      }
    }
    return true;
  }
  
  /* Checks if the entire board is free of clashes. 
   */
  function checkBoard(brd) {
    for (var r=0;r<9;r++) {  // check same column
      for (var c=0;c<9;c++) {  // check same column
        if (!checkCell(brd, r, c)) {
          $('#log').text("board not OK");
          return false;
        }
      }
    }
    $('#log').text("board OK");
    return true;
  }
  
  /*
  */
  function solveBoard(brd, row, col) {
    if (row == 9) {
      printBoard(brd);
      $("#log").text("SOLVED");
      return true;
    } 
    if (brd[row][col] != 0) {
      let next = nextCell(brd, row, col);
      log += "<br/>" + row + col + "z" + next[0] + next[1];
      return solveBoard(brd, next[0], next[1]);
    }
    for (let n=1;n<=9;n++) {  
      brd[row][col] = n;
      //log += "<br/>" + row + col + n;
      if (checkCell(brd, row, col)) {
        let next = nextCell(brd, row, col);
        if (solveBoard(brd, next[0], next[1])) {
          return true;
        }
      }  
    }
    brd[row][col] = 0;
    return false;
  }
  
  /*
  */
  function nextCell(brd, row, col) {
    let nextRow = row;
    let nextCol = col;
    nextCol++;
    if (nextCol == 9) {
      nextCol = 0;
      nextRow++;
    }
    return [nextRow, nextCol];
  }
  
  $(document).keydown(function(e){
    if (e.keyCode == 37) { // left arrow
      if (currentCol > 1) currentCol--;
      ChangeCurrentCell();
      return false;
    }
    if (e.keyCode == 38) { // up arrow
      if (currentRow > 1) currentRow--;
      ChangeCurrentCell();
      return false;
    }
    if (e.keyCode == 39) { // right arrow
      if (currentCol < 9) currentCol++;
      ChangeCurrentCell();
      return false;
    }
    if (e.keyCode == 40) { // down arrow
      if (currentRow < 9) currentRow++;
      ChangeCurrentCell();
      return false;
    }
  });
});
