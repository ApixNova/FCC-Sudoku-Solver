"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let puzzle = req.body.puzzle;
    let coord = req.body.coordinate;
    let value = req.body.value;

    if (
      puzzle == undefined ||
      coord == undefined ||
      value == undefined ||
      value == ""
    ) {
      res.json({ error: "Required field(s) missing" });
    } else {
      let validCheck = solver.validate(puzzle);
      if (validCheck == "valid") {
        //check and handle error
        if ("123456789".includes(value) && value.length == 1) {
          if (
            coord.length == 2 &&
            "ABCDEFGHI".includes(coord[0]) &&
            "123456789".includes(coord[1])
          ) {
            let conflict = [];
            if (!solver.checkRowPlacement(puzzle, coord[0], coord[1], value)) {
              conflict.push("row");
            }
            if (!solver.checkColPlacement(puzzle, coord[0], coord[1], value)) {
              conflict.push("column");
            }
            if (
              !solver.checkRegionPlacement(puzzle, coord[0], coord[1], value)
            ) {
              conflict.push("region");
            }
            if (conflict.length == 0) {
              res.json({ valid: true });
            } else {
              res.json({
                valid: false,
                conflict: conflict,
              });
            }
          } else {
            res.json({ error: "Invalid coordinate" });
          }
        } else {
          res.json({ error: "Invalid value" });
        }
      } else {
        res.json({ error: validCheck });
      }
    }
  });

  app.route("/api/solve").post((req, res) => {
    //check if the puzzle is valid
    let puzzle = req.body.puzzle;
    if (puzzle == undefined || puzzle == "") {
      res.json({ error: "Required field missing" });
    } else {
      let validCheck = solver.validate(puzzle);
      if (validCheck == "valid") {
        //solve and handle error
        let solution = solver.solve(puzzle);
        if (solution) {
          res.json({ solution: solution });
        } else {
          res.json({ error: "Puzzle cannot be solved" });
        }
      } else {
        res.json({ error: validCheck });
      }
    }
  });
};
