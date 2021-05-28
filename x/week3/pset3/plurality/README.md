# [Week 3](../../) / Problem Set 3

### Plurality

A program that runs a [Plurality election](https://en.wikipedia.org/wiki/Plurality_voting).

[🔗 Read more about the problem](https://cs50.harvard.edu/x/2021/psets/3/plurality)

##### Requirements

:white_check_mark: Complete the `vote` function:

-   `vote` takes a single argument, a `string` called `name`, representing the name of the candidate who was voted for.
-   If `name` matches one of the names of the candidates in the election, then update that candidate’s vote total to account for the new vote. The `vote` function in this case should return `true` to indicate a successful ballot.
-   If `name` does not match the name of any of the candidates in the election, no vote totals should change, and the `vote` function should return `false` to indicate an invalid ballot.
-   You may assume that no two candidates will have the same name.

:white_check_mark: Complete the `print_winner` function:

-   The function should print out the name of the candidate who received the most votes in the election, and then print a newline.
-   It is possible that the election could end in a tie if multiple candidates each have the maximum number of votes. In that case, you should output the names of each of the winning candidates, each on a separate line.

:white_check_mark: Must handle:

-   An election with any number of candidate (up to the `MAX` of `9`).
-   Voting for a candidate by name.
-   Invalid votes for candidates who are not on the ballot.
-   Printing the winner of the election if there is only one.
-   Printing the winner of the election if there are multiple winners.

:white_check_mark: Nothing else should be modified in `plurality.c` other than the implementations of the `vote` and `print_winner` functions (and the inclusion of additional header files, if you’d like).

##### Examples

```bash
# Example 1
$ ./plurality Alice Bob Charlie
Number of voters: 4
Vote: Alice
Vote: Bob
Vote: Charlie
Vote: Alice
Alice

# Example 2
$ ./plurality Alice Bob
Number of voters: 3
Vote: Alice
Vote: Bob
Vote: Alice
Alice

# Example 3
$ ./plurality Alice Bob
Number of voters: 3
Vote: Alice
Vote: Charlie
Invalid vote.
Vote: Alice
Alice

# Example 4
$ ./plurality Alice Bob Charlie
Number of voters: 5
Vote: Alice
Vote: Charlie
Vote: Bob
Vote: Bob
Vote: Alice
Alice
Bob
```

##### Usage

```bash
# Compile
$ make plurality
# Execute
$ ./plurality
```
