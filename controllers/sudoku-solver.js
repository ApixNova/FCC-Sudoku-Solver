class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return "Expected puzzle to be 81 characters long";
      // Invalid characters in puzzle
    } else if (
      !puzzleString.split("").every((val) => [...".123456789"].includes(val))
    ) {
      return "Invalid characters in puzzle";
    } else {
      return "valid";
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowPos = [..."ABCDEFGHI"].indexOf(row);
    for (let i = 0; i < 9; i++) {
      if (puzzleString[rowPos * 9 + i] == value && i != column - 1) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rowPos = [..."ABCDEFGHI"].indexOf(row);
    for (let i = 0; i < 9; i++) {
      if (puzzleString[i * 9 + column * 1 - 1] == value && i != rowPos) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowPos = [..."ABCDEFGHI"].indexOf(row);
    let possibleRegions = [
      "ABC123",
      "ABC456",
      "ABC789",
      "DEF123",
      "DEF456",
      "DEF789",
      "GHI123",
      "GHI456",
      "GHI789",
    ];

    let currentRegion = "";

    for (const region of possibleRegions) {
      if (region.includes(row) && region.includes(column)) {
        currentRegion = region;
      }
    }

    let debugRegion = [];

    for (
      let i = [..."ABCDEFGHI"].indexOf(currentRegion[0]);
      i <= [..."ABCDEFGHI"].indexOf(currentRegion[2]);
      i++
    ) {
      for (let j = currentRegion[3]; j <= currentRegion[5]; j++) {
        const position = i * 9 + j * 1 - 1;
        if (
          puzzleString[position] == value &&
          position != rowPos * 9 + column * 1 - 1
        ) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    //creating an array of the puzzle string
    let puzzle = [...puzzleString];
    let firstMod = puzzleString.indexOf(".");
    //if no '.' found, return puzzleString
    if (firstMod == -1) {
      return puzzleString;
    }
    if (this.validate(puzzleString) != "valid") {
      return false;
    }

    let modifiedPos = []; // Will have all positions to fill
    for (let i = 0; i < 81; i++) {
      if (puzzle[i] == ".") {
        modifiedPos.push(i);
      }
    }
    // Run once for every
    let startingAt = 0;
    let startingNum = 1;

    while (puzzle.includes(".")) {
      //we loop through the positions to fill
      for (let i = startingAt; i < modifiedPos.length; i++) {
        let row = "ABCDEFGHI"[Math.floor(modifiedPos[i] / 9)];
        let column = (modifiedPos[i] % 9) + 1;
        let found = false;

        for (let j = startingNum; j <= 9; j++) {
          if (
            !found &&
            this.checkRowPlacement(puzzle, row, column, j) &&
            this.checkColPlacement(puzzle, row, column, j) &&
            this.checkRegionPlacement(puzzle, row, column, j)
          ) {
            //update the puzzle array
            puzzle[modifiedPos[i]] = j;
            found = true;
          }
        }
        if (!puzzle.includes(".")) {
          break;
        }
        startingNum = 1;
        //if we have a conflict change last guess to a higher number, if we can't. Change the guess before..
        if (!found) {
          //set a value to start counting from and make it start from n-1
          startingAt = i - 1;
          startingNum = puzzle[modifiedPos[i - 1]] + 1;
          //continue until the first guess. If there is still conflict it is not solvable.
          if (i == 0) {
            return false;
          }
          found = false;
          //clear the rest of the puzzle
          for (let i = startingAt; i < modifiedPos.length; i++) {
            puzzle[modifiedPos[i]] = ".";
          }
          break;
        }
      }
    }

    return puzzle.join("");
  }
}

module.exports = SudokuSolver;
