# [Week 3](../../) / Lab 3

### Sort

A program which analyzes three sorting programs to determine which algorithms they use.

[🔗 Read more about the lab](https://cs50.harvard.edu/x/2021/labs/3)

##### Background

On the lecture, we saw a few algorithms for sorting a sequence of numbers: selection sort, bubble sort, and merge sort.

-   Selection sort iterates through the unsorted portions of a list, selecting the smallest element each time and moving it to its correct location.
-   Bubble sort compares pairs of adjacent values one at a time and swaps them if they are in the incorrect order. This continues until the list is sorted.
-   Merge sort recursively divides the list into two repeatedly and then merges the smaller lists back into a larger one in the correct order.

##### Requirements

Provided to you are three already-compiled C programs, `sort1`, `sort2`, and `sort3`. Each of these programs implements a different sorting algorithm: selection sort, bubble sort, or merge sort (though not necessarily in that order!). Your task is to determine which sorting algorithm is used by each file.

:white_check_mark: `sort1`, `sort2`, and `sort3` are binary files, so you won’t be able to view the C source code for each. To assess which sort implements which algorithm, run the sorts on different lists of values.
:white_check_mark: Multiple `.txt` files are provided to you. These files contain n lines of values, either reversed, shuffled, or sorted.
:white_check_mark: For example, `reversed10000.txt` contains 10000 lines of numbers that are reversed from `10000`, while `random100000.txt` contains 100000 lines of numbers that are in random order.
:white_check_mark: To run the sorts on the text files, in the terminal, run `./[program_name] [text_file.txt]`.
:white_check_mark: For example, to sort `reversed10000.txt` with sort1, run `./sort1 reversed10000.txt`.
:white_check_mark: You may find it helpful to time your sorts. To do so, run `time ./[sort_file] [text_file.txt]`.
:white_check_mark: For example, you could run time `./sort1 reversed10000.txt` to run `sort1` on 10,000 reversed numbers. At the end of your terminal’s output, you can look at the `real` time to see how much time actually elapsed while running the program.
:white_check_mark: Record your answers in `answers.txt`, along with an explanation for each program, by filling in the blanks marked `TODO`.

##### Usage

```bash
# Compile
$ make sort
# Execute
$ ./sort
```
