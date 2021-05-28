# [Week 2](../../) / Problem Set 2

### Substitution

A program that implements a [Substitution cipher](https://en.wikipedia.org/wiki/Substitution_cipher).

[🔗 Read more about the problem](https://cs50.harvard.edu/x/2021/psets/2/substitution)

##### Requirements

:white_check_mark: The program must accept a single command-line argument, the key to use for the substitution. The key itself should be case-insensitive, so whether any character in the key is uppercase or lowercase should not affect the behavior of the program.
:white_check_mark: If the program is executed without any command-line arguments or with more than one command-line argument, the program should print an error message of your choice (with printf) and return from main a value of 1 (which tends to signify an error) immediately.
:white_check_mark: If the key is invalid (as by not containing 26 characters, containing any character that is not an alphabetic character, or not containing each letter exactly once), the program should print an error message of your choice (with printf) and return from main a value of 1 immediately.
:white_check_mark: Must output plaintext: (without a newline) and then prompt the user for a string of plaintext (using get_string).
:white_check_mark: Must output ciphertext: (without a newline) followed by the plaintext’s corresponding ciphertext, with each alphabetical character in the plaintext substituted for the corresponding character in the ciphertext; non-alphabetical characters should be outputted unchanged.
:white_check_mark: Must preserve case: capitalized letters must remain capitalized letters; lowercase letters must remain lowercase letters.
:white_check_mark: After outputting ciphertext, you should print a newline. The program should then exit by returning 0 from main.

##### Examples

```
$ ./substitution YTNSHKVEFXRBAUQZCLWDMIPGJO
plaintext:  HELLO
ciphertext: EHBBQ

$ ./substitution JTREKYAVOGDXPSNCUIZLFBMWHQ
plaintext:  HELLO
ciphertext: VKXXN

$ ./substitution VCHPRZGJNTLSKFBDQWAXEUYMOI
plaintext:  hello, world
ciphertext: jrssb, ybwsp

```

##### Usage

```bash
# Compile
$ make substitution
# Execute
$ ./substitution
```
