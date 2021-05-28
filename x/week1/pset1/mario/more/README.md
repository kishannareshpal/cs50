# [Week 1](../../../) / Problem Set 1

### Mario (More comfortable)

Recreate those Mario pyramid in C, albeit in text, using hashes (`#`) for bricks as seen below. Each hash is a bit taller than it is wide, so the pyramid itself is also be taller than it is wide.

##### Background

Toward the beginning of World 1-1 in Nintendo’s Super Mario Brothers, Mario must hop over adjacent pyramids of blocks, per the below.

![Mario World 1-1](https://cs50.harvard.edu/x/2021/psets/1/mario/more/pyramids.png)

##### Requirements

:white_check_mark: Must allow the user to decide just how tall the pyramid should be by prompting them for a positive integer between, 1 and 8, inclusive. Re-prompt the user if user inputs something different until they cooperate.\
:white_check_mark: Width of the “gap” between adjacent pyramids is equal to the width of two hashes, irrespective of the pyramid's heights.

##### Example

```
$ ./mario
Height: 4
   #  #
  ##  ##
 ###  ###
####  ####
```

##### Usage

```bash
# Compile
$ make mario
# Execute
$ ./mario
```
