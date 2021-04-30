# [Week 1](../) / Lab 1

### Population

A program to determine how long it takes for a population to reach a particular size.

##### Background

Say we have a population of `n` llamas. Each year, `n / 3` new llamas are born, and `n / 4` llamas pass away.

For example, if we were to start with `n = 1200` llamas, then in the first year, `1200 / 3 = 400` new llamas would be born and `1200 / 4 = 300` llamas would pass away. At the end of that year, we would have `1200 + 400 - 300 = 1300` llamas.

To try another example, if we were to start with `n = 1000` llamas, at the end of the year, we would have `1000 / 3 = 333.33` new llamas. We can’t have a decimal portion of a llama, though, so we’ll truncate the decimal to get `333` new llamas born. `1000 / 4 = 250` llamas will pass away, so we’ll end up with a total of `1000 + 333 - 250 = 1083` llamas at the end of the year.

##### Example

```bash
$ ./population
Start size: 100
End size: 200
Years: 9 # Output
```

##### Requirements

:white_check_mark: Prompt the user for a starting population size.\
:white_check_mark: If the user enters a number less than 9 (the minimum allowed population size), the user should be re-prompted to enter a starting population size until they enter a number that is greater than or equal to 9. (If we start with fewer than 9 llamas, the population of llamas will quickly become stagnant!)\
:white_check_mark: Then prompt the user for an ending population size. If the user enters a number less than the starting population size, the user should be re-prompted to enter an ending population size until they enter a number that is greater than or equal to the starting population size. (After all, we want the population of llamas to grow!)\
:white_check_mark: Calculate the (integer) number of years required for the population to reach at least the size of the end value.\
:white_check_mark: Finally, print the number of years required for the llama population to reach that end size, as by printing to the terminal `Years: n`, where n is the number of years.

##### Usage

```bash
# Compile
$ make population.c
# Execute
$ ./population
```
