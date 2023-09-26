const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

let valid =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let solution =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
let incompletePuzzle = ".".repeat(81);
let solitionToImcomplete =
  "123456789456789123789123456214365897365897214897214365531642978642978531978531642";
let invalidChar = "a".repeat(81);
let invalidLength = "123.";

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function () {
    assert.equal("valid", solver.validate(valid));
  });
  test("Logic handles a puzzle string with invalid characters", function () {
    assert.equal("Invalid characters in puzzle", solver.validate(invalidChar));
  });
  test("Logic handles a puzzle string that is not 81 characters in length", function () {
    assert.equal(
      "Expected puzzle to be 81 characters long",
      solver.validate(invalidLength)
    );
  });
  test("Logic handles a valid row placement", function () {
    assert.equal(true, solver.checkRowPlacement(valid, "A", 2, 9));
  });
  test("Logic handles an invalid row placement", function () {
    assert.equal(false, solver.checkRowPlacement(valid, "A", 2, 4));
  });
  test("Logic handles a valid column placement", function () {
    assert.equal(true, solver.checkColPlacement(valid, "H", 1, 5));
  });
  test("Logic handles an invalid column placement", function () {
    assert.equal(false, solver.checkColPlacement(valid, "H", 1, 2));
  });
  test("Logic handles a valid region (3x3 grid) placement", function () {
    assert.equal(true, solver.checkRegionPlacement(valid, "A", 2, 3));
  });
  test("Logic handles an invalid region (3x3 grid) placement", function () {
    assert.equal(false, solver.checkRegionPlacement(valid, "A", 2, 6));
  });
  test("Valid puzzle strings pass the solver", function () {
    assert.equal(solution, solver.solve(valid));
  });
  test("Invalid puzzle strings fail the solver", function () {
    assert.equal(false, solver.solve(invalidLength));
  });
  test("Solver returns the expected solution for an incomplete puzzle", function () {
    assert.equal(solitionToImcomplete, solver.solve(incompletePuzzle));
  });
});
