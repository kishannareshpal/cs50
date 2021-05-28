# [Week 3](../../) / Problem Set 3

### Tideman

A program that runs a [Tideman election](https://en.wikipedia.org/wiki/Ranked_pairs).

[🔗 Read more about the problem](https://cs50.harvard.edu/x/2021/psets/3/runoff)

##### Requirements

:white_check_mark: Must handle:

-   An election with any number of candidate (up to the `MAX` of `9`)
-   Voting for a candidate by name
-   Invalid votes for candidates who are not on the ballot
-   Printing the winner of the election

:white_check_mark: Complete the `vote` function.

-   The function takes arguments `rank`, `name`, and `ranks`. If `name` is a match for the name of a valid candidate, then you should update the `ranks` array to indicate that the voter has the candidate as their `rank` preference (where `0` is the first preference, `1` is the second preference, etc.)
-   Recall that `ranks[i]` here represents the user’s `i`th preference.
-   The function should return `true` if the rank was successfully recorded, and false otherwise (if, for instance, `name` is not the name of one of the candidates).
-   You may assume that no two candidates will have the same name.

:white_check_mark: Complete the `record_preferences` function.

-   The function is called once for each voter, and takes as argument the `ranks` array, (recall that `ranks[i]` is the voter’s `i`th preference, where `ranks[0]` is the first preference).
-   The function should update the global `preferences` array to add the current voter’s preferences. Recall that `preferences[i][j]` should represent the number of voters who prefer candidate `i` over candidate `j`.
-   You may assume that every voter will rank each of the candidates.

:white_check_mark: Complete the `add_pairs` function.

-   The function should add all pairs of candidates where one candidate is preferred to the `pairs` array. A pair of candidates who are tied (one is not preferred over the other) should not be added to the array.
-   The function should update the global variable `pair_count` to be the number of pairs of candidates. (The pairs should thus all be stored between `pairs[0]` and `pairs[pair_count - 1]`, inclusive).

:white_check_mark: Complete the `sort_pairs` function.

-   The function should sort the `pairs` array in decreasing order of strength of victory, where strength of victory is defined to be the number of voters who prefer the preferred candidate. If multiple pairs have the same strength of victory, you may assume that the order does not matter.
-   Complete the `lock_pairs` function.
-   The function should create the `locked` graph, adding all edges in decreasing order of victory strength so long as the edge would not create a cycle.

:white_check_mark: Complete the `print_winner` function.

-   The function should print out the name of the candidate who is the source of the graph. You may assume there will not be more than one source.

:white_check_mark: Nothing else should be modified in `tideman.c` other than the implementations of the `vote`, `record_preferences`, `add_pairs`, `sort_pairs`, `lock_pairs`, and `print_winner` functions (and the inclusion of additional header files, if you’d like). You are permitted to add additional functions to `tideman.c`, so long as you do not change the declarations of any of the existing functions.

##### Examples

```bash
# Example 1
./tideman Alice Bob Charlie
Number of voters: 5
Rank 1: Alice
Rank 2: Charlie
Rank 3: Bob

Rank 1: Alice
Rank 2: Charlie
Rank 3: Bob

Rank 1: Bob
Rank 2: Charlie
Rank 3: Alice

Rank 1: Bob
Rank 2: Charlie
Rank 3: Alice

Rank 1: Charlie
Rank 2: Alice
Rank 3: Bob

Charlie
```

##### Usage

```bash
# Compile
$ make tideman
# Execute
$ ./tideman
```
