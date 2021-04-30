# [Week 2](../) / Lab 2

### Scrabble

A program to determine which determines the winner of a short scrabble-like game, where two players each enter their word, and the higher scoring player wins.

##### Background

In the game of [Scrabble](https://scrabble.hasbro.com/en-us/rules), players create words to score points, and the number of points is the sum of the point values of each letter in the word.

| A   | B   | C   | D   | E   | F   | G   | H   | I   | J   | K   | L   | M   | N   | O   | P   | Q   | R   | S   | T   | U   | V   | W   | X   | Y   | Z   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1   | 3   | 3   | 2   | 1   | 4   | 2   | 4   | 1   | 8   | 5   | 1   | 3   | 1   | 1   | 3   | 10  | 1   | 1   | 1   | 1   | 4   | 4   | 8   | 4   | 10  |

For example, if we wanted to score the word `Code`, we would note that in general Scrabble rules, the `C` is worth `3` points, the `o` is worth `1` point, the `d` is worth `2`points, and the `e` is worth `1` point. Summing these, we get that Code is worth `3 + 1 + 2 + 1 = 7` points.

##### Example

```bash
$ ./scrabble
Player 1: Farm # 4 + 1 + 1 + 3 = 9 points.
Player 2: Horn # 4 + 1 + 1 + 1 = 7 points.
Player 1 wins! # Output: The player with the most points, wins.
```

```bash
$ ./scrabble
Player 1: Oh, # 1 + 4 + 0 = 5 points.
Player 2: hai! # 4 + 1 + 1 + 0 = 6 points.
Player 2 wins! # Output: The player with the most points, wins.
```

##### Requirements

-   :white_check_mark: Prompt each player for their word, storing them inside `word1` and `word2` named variables.
-   :white_check_mark: The score should be computed using the `POINTS` array and returned for the string arguments.
-   :white_check_mark: Characters that are not letters should be given zero points, and uppercase and lowercase letters should be given the same point values.

    -   :white_check_mark: `!` is worth `0` points while `A` and `a` are both worth `1` point.
    -   :white_check_mark: Though Scrabble rules normally require that a word be in the dictionary, no need to check for that in this problem!

-   :white_check_mark: Finally, print depending on the player's scores, `Player 1 wins!`, `Player 2 wins!`, or `Tie!`.
