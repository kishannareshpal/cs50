# [Week 2](../../) / Problem Set 2

### Caesar

A program that encrypts messages using [Caesar's cipher](https://en.wikipedia.org/wiki/Caesar_cipher).

[🔗 Read more about the problem](https://cs50.harvard.edu/x/2021/psets/2/caesar)

##### Requirements

:white_check_mark: Must accept a single command-line argument, a non-negative integer. Let’s call it k for the sake of discussion.
:white_check_mark: If the program is executed without any command-line arguments or with more than one command-line argument, the program should print an error message of your choice (with printf) and return from main a value of 1 (which tends to signify an error) immediately.
:white_check_mark: If any of the characters of the command-line argument is not a decimal digit, the program should print the message Usage: ./caesar key and return from main a value of 1.
:white_check_mark: Do not assume that k will be less than or equal to 26. The program should work for all non-negative integral values of k less than 2^31 - 26. In other words, you don’t need to worry if the program eventually breaks if the user chooses a value for k that’s too big or almost too big to fit in an int. (Recall that an int can overflow.) But, even if k is greater than 26, alphabetical characters in the program’s input should remain alphabetical characters in the program’s output. For instance, if k is 27, A should not become [ even though [ is 27 positions away from A in ASCII, per http://www.asciichart.com/[asciichart.com]; A should become B, since B is 27 positions away from A, provided you wrap around from Z to A.
:white_check_mark: Must output plaintext: (without a newline) and then prompt the user for a string of plaintext (using get_string).
:white_check_mark: Must output ciphertext: (without a newline) followed by the plaintext’s corresponding ciphertext, with each alphabetical character in the plaintext “rotated” by k positions; non-alphabetical characters should be outputted unchanged.
:white_check_mark: Must preserve case: capitalized letters, though rotated, must remain capitalized letters; lowercase letters, though rotated, must remain lowercase letters.
:white_check_mark: After outputting ciphertext, you should print a newline. The program should then exit by returning 0 from main.

##### Examples

```
$ ./caesar 13
plaintext:  HELLO
ciphertext: URYYB

$ ./caesar 13
plaintext:  be sure to drink your Ovaltine
ciphertext: or fher gb qevax lbhe Binygvar
```

##### Usage

```bash
# Compile
$ make caesar
# Execute
$ ./caesar
```
