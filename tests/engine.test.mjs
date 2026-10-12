import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const inlineScript = html.split("<script>")[1].split("</script>")[0];
const engineStart = inlineScript.indexOf("const DIRS=");
const engineEnd = inlineScript.indexOf("/* ================= Audio", engineStart);
assert.notEqual(engineStart, -1, "engine constants should be present");
assert.notEqual(engineEnd, -1, "engine should end before the audio code");

const engine = new Function(
  `${inlineScript.slice(engineStart, engineEnd)}
return { DIRS, W8, FILES, inB, opp, startBoard, flipsFor, validMoves, applyMove, countDiscs };`,
)();

const {
  startBoard,
  flipsFor,
  validMoves,
  applyMove,
  countDiscs,
} = engine;

test("the start position has four legal black moves and two discs each", () => {
  const board = startBoard();
  assert.deepEqual(countDiscs(board), { B: 2, W: 2, empty: 60 });
  assert.equal(validMoves(board, "B").length, 4);
});

test("playing D3 for black flips exactly one disc", () => {
  const board = startBoard();
  const flipped = applyMove(board, 2, 3, "B");

  assert.deepEqual(flipped, [[3, 3]]);
  assert.equal(board[2][3], "B");
  assert.equal(board[3][3], "B");
});

test("applyMove rejects a move that flips nothing", () => {
  const board = startBoard();
  const before = board.map((row) => row.slice());

  assert.equal(applyMove(board, 0, 0, "B"), null);
  assert.deepEqual(board, before);
});

test("flipsFor finds a diagonal capture", () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[1][1] = "W";
  board[2][2] = "B";

  assert.deepEqual(flipsFor(board, 0, 0, "B"), [[1, 1]]);
});

test("validMoves is empty when a player has no legal move", () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill("W"));
  board[0][0] = null;

  assert.deepEqual(validMoves(board, "B"), []);
});

test("countDiscs totals always include all 64 squares", () => {
  const boards = [startBoard()];
  const afterMove = startBoard();
  applyMove(afterMove, 2, 3, "B");
  boards.push(afterMove);

  for (const board of boards) {
    const counts = countDiscs(board);
    assert.equal(counts.B + counts.W + counts.empty, 64);
  }
});
