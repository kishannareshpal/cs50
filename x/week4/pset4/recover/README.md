# [Week 4](../../) / Problem Set 4

### Recover

A program that recovers JPEGs from a forensic image

[🔗 Read more about the problem](https://cs50.harvard.edu/x/2021/psets/4/recover)

##### Requirements

Implement a program called `recover` that recovers JPEGs from a forensic image.

:white_check_mark: Your program should accept exactly one command-line argument, the name of a forensic image from which to recover JPEGs.\
:white_check_mark: If your program is not executed with exactly one command-line argument, it should remind the user of correct usage, and `main` should return `1`.\
:white_check_mark: If the forensic image cannot be opened for reading, your program should inform the user as much, and `main` should return `1`.\
:white_check_mark: The files you generate should each be named `###.jpg`, where `###` is a three-digit decimal number, starting with `000` for the first image and counting up.\
:white_check_mark: Your program, if it uses `malloc`, must not leak any memory.

##### Example

```bash
# Recover images from the image file (card.raw) and save them as ###.jpg where ### is the number of the image up until now that was generated.
$ ./recover card.raw
```

##### Usage

```bash
# Compile
$ make recover
# Execute
$ ./recover image
```
