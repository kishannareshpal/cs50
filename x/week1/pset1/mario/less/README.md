# [Week 1](../../../) / Problem Set 1

### Mario (Less comfortable)

Recreate the Mario pyramid in C, albeit in text, using hashes (`#`) for bricks as seen below. Each hash is a bit taller than it is wide, so the pyramid itself is also be taller than it is wide.

##### Background

Toward the end of World 1-1 in Nintendo’s Super Mario Brothers, Mario must ascend right-aligned pyramid of blocks, a la the below.

![Mario World 1-1](https://cs50.harvard.edu/x/2021/psets/1/mario/less/pyramid.png)

##### Requirements

:white_check_mark: Must allow the user to decide just how tall the pyramid should be by prompting them for a positive integer between, 1 and 8, inclusive. Re-prompt the user if user inputs something different until they cooperate.\
:white_check_mark: Must be right aligned.

##### Example

```
$ ./mario
Height: 8
       #
      ##
     ###
    ####
   #####
  ######
 #######
########
```

##### Usage

```bash
# Compile
$ make mario.c
# Execute
$ ./mario
```
