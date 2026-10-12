# AI engine

The opponent is a depth-limited, heuristic Othello player implemented in
`index.html`. It generates legal moves with `validMoves()`, applies them with
`applyMove()`, and searches from the current position rather than using a
precomputed move list.

## Position weights

`W8` is an 8×8 positional-weight table, read in row-major order. A disc's
weight is added for the side being evaluated and subtracted for its opponent.
The values express how desirable a square is before the other terms in the
evaluation are considered:

- Corners are worth **120**, making them the most desirable stable squares.
- Squares immediately beside a corner on an edge are **-20**; the analogous
  squares one row or column in from a corner are **-40**. These values warn
  the search about moves that can give away a corner.
- Other edge squares are positive but smaller: **20** near a corner and **5**
  in the middle of an edge. Interior squares are generally **3**, with the
  next-to-corner interior region reaching **15**. The negative and positive
  edge values are positional preferences, not guaranteed outcomes.

`evaluate(b, p)` combines those weights with three signals. It adds a **250**
bonus for each corner held by `p` (or subtracts it for an opponent-held
corner), adds twice the disc-count difference, and adds twelve times the
mobility difference (legal moves for `p` minus legal moves for the opponent).
The weighted positional total is multiplied by four before these latter two
terms are added:

```text
4 × (positional weights + corner bonuses)
  + 2 × (my discs - opponent discs)
  + 12 × (my legal moves - opponent legal moves)
```

## Search

`minimax(b, depth, alpha, beta, turn, root)` explores legal moves recursively.
At the root side it keeps the highest `evaluate()` result; at the opposing
side it keeps the lowest. It orders candidates by descending `W8` value and
then by number of discs flipped. Alpha-beta pruning stops a branch when
`beta <= alpha`, so branches that cannot improve the result are not searched.
Search stops at depth zero or when neither side has a legal move.

If `turn` has no legal move but the other side does, `minimax()` passes the
turn to the opponent and continues at one lower depth. At the game level,
`advance()` does the same: it records a pass and lets the other side play.
If neither side has a legal move, the game ends. `engineMove()` returns `null`
when its requested side has no legal move.

## Difficulty

`engineMove()` maps the three UI names to the internal difficulty values and
search depths:

| UI name | Internal value | Depth |
| --- | --- | ---: |
| Muse | `easy` | 1 |
| Scholar | `medium` | 3 |
| Oracle | `hard` | 5 |

Muse also chooses a random legal move 35% of the time; otherwise all three
levels use the minimax result (falling back to the first legal move if needed).

## Limits

- There is no opening book.
- There is no dedicated endgame solver or exact exhaustive endgame search.
- Search is fixed-depth, not time-based, and uses the simple heuristic above.
- The engine does not learn from games or retain analysis between moves.
