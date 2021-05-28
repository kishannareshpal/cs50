# [Week 2](../../) / Problem Set 2

### Readability

A program that computes the approximate grade level needed to comprehend some text using the [Coleman-Liau index](https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index).\
The Coleman-Liau index of a text is designed to output what (U.S.) grade level is needed to understand the text.

[🔗 Read more about the problem](https://cs50.harvard.edu/x/2021/psets/2/readability)

##### Requirements

:white_check_mark: Prompt the user for a string of text (using `get_string`).\
:white_check_mark: Count the number of letters, words, and sentences in the text. You may assume that a letter is any lowercase character from a to z or any uppercase character from A to Z, any sequence of characters separated by spaces should count as a word, and that any occurrence of a period, exclamation point, or question mark indicates the end of a sentence.\
:white_check_mark: Print as output "Grade X" where X is the grade level computed by the Coleman-Liau formula, rounded to the nearest integer.\
:white_check_mark: If the resulting index number is 16 or higher (equivalent to or greater than a senior undergraduate reading level), your program should output "Grade 16+" instead of giving the exact index number. If the index number is less than 1, your program should output "Before Grade 1".\

##### Examples

```
$ ./readability
Text: Congratulations! Today is your day. You're off to Great Places! You're off and away!
Grade 3
```

##### Usage

```bash
# Compile
$ make readability
# Execute
$ ./readability
```
