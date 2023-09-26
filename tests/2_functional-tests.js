const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let valid =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let solution =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
let unsolvable =
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...5......1945....4.37.4.3..6..";
let incompletePuzzle = ".".repeat(81);
let solitionToImcomplete =
  "123456789456789123789123456214365897365897214897214365531642978642978531978531642";
let invalidChar = "a".repeat(81);
let invalidLength = "123.";

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: valid })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, solution);
        done();
      });
  });
  test("Solve a puzzle with missing puzzle string: POST request", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"error":"Required field missing"}'
        );
        done();
      });
  });
  test("Solve a puzzle with invalid characters: POST request", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: invalidChar })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"error":"Invalid characters in puzzle"}'
        );
        done();
      });
  });
  test("Solve a puzzle with incorrect length: POST request", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: invalidLength })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"error":"Expected puzzle to be 81 characters long"}'
        );
        done();
      });
  });
  test("Solve a puzzle that cannot be solved: POST request", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({ puzzle: unsolvable })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"error":"Puzzle cannot be solved"}'
        );
        done();
      });
  });
  test("Check a puzzle placement with all fields: POST request", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: valid,
        coordinate: "A2",
        value: 3,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(JSON.stringify(res.body), '{"valid":true}');
        done();
      });
  });
  test("Check a puzzle placement with single placement conflict: POST request", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: valid,
        coordinate: "A2",
        value: 8,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"valid":false,"conflict":["row"]}'
        );
        done();
      });
  });
  test("Check a puzzle placement with multiple placement conflicts: POST request", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: valid,
        coordinate: "A2",
        value: 6,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"valid":false,"conflict":["column","region"]}'
        );
        done();
      });
  });
  test("Check a puzzle placement with all placement conflicts: POST request", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: valid,
        coordinate: "A2",
        value: 2,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"valid":false,"conflict":["row","column","region"]}'
        );
        done();
      });
  });
  test("Check a puzzle placement with missing required fields: POST request", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: valid,
        coordinate: "A2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"error":"Required field(s) missing"}'
        );
        done();
      });
  });
  test("Check a puzzle placement with invalid characters: POST request", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: invalidChar,
        coordinate: "A2",
        value: 9,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"error":"Invalid characters in puzzle"}'
        );
        done();
      });
  });
  test("Check a puzzle placement with incorrect length: POST request", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: invalidLength,
        coordinate: "A2",
        value: 9,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"error":"Expected puzzle to be 81 characters long"}'
        );
        done();
      });
  });
  test("Check a puzzle placement with invalid placement coordinate: POST request", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: valid,
        coordinate: "K0",
        value: 9,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          JSON.stringify(res.body),
          '{"error":"Invalid coordinate"}'
        );
        done();
      });
  });
  test("Check a puzzle placement with invalid placement value: POST request", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .type("form")
      .send({
        puzzle: valid,
        coordinate: "A2",
        value: 10,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(JSON.stringify(res.body), '{"error":"Invalid value"}');
        done();
      });
  });
});
