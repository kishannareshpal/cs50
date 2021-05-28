# [Week 1](../../) / Problem Set 1

### Cash (Greedy Algorithms)

A program which decides which coins and how many of them to give back to customer.\
Think of a “greedy” cashier as one who wants to take the biggest bite out of this problem as possible with each coin they take out of the drawer. For instance, if some customer is owed 41¢, the biggest first (i.e., best immediate, or local) bite that can be taken is 25¢. (That bite is “best” inasmuch as it gets us closer to 0¢ faster than any other coin would.) Note that a bite of this size would whittle what was a 41¢ problem down to a 16¢ problem, since 41 - 25 = 16. That is, the remainder is a similar but smaller problem. Needless to say, another 25¢ bite would be too big (assuming the cashier prefers not to lose money), and so our greedy cashier would move on to a bite of size 10¢, leaving him or her with a 6¢ problem. At that point, greed calls for one 5¢ bite followed by one 1¢ bite, at which point the problem is solved. The customer receives one quarter, one dime, one nickel, and one penny: four coins in total.

Assume only coins available are quarters (`25¢`), dimes (`10¢`), nickels (`5¢`), and pennies (`1¢`).

##### Requirements

:white_check_mark: Get user input asking for change using `get_float`.\
:white_check_mark: If the user fails to provide a non-negative value, re-prompt the user for a valid amount again and again until the user complies.\
:white_check_mark: Take care to round your cents to the nearest penny, as with round, which is declared in math.h. For instance, if dollars is a float with the user’s input (e.g., `0.20` or even `0.200000002980232238769531250`) will safely convert to `20`.

##### Examples

```
$ ./cash
Change: 0.41
4

Change: 1.6
7

Change: 23
92
```

##### Usage

```bash
# Compile
$ make cash
# Execute
$ ./cash
```
