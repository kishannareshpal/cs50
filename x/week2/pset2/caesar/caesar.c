#include <cs50.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <stdlib.h>

string ALPHABET = "abcdefghijklmnopqrstuvwxyz";

bool is_number(string str);
int get_alpha_index(char c);

int main(int argc, string argv[])
{
    if (argc != 2)
    {
        // Must only have one argument.
        printf("Usage: ./caesar key\n");
        return 1;
    }
    else
    {
        // Get the argument, which is the key (the number of times to shift the plaintext character)
        string argument = argv[1];
        if (!is_number(argument))
        {
            // The argument, must be a numeric value
            printf("Usage: ./caesar key\n");
            return 1;
        }
        else
        {
            // Cast the key received as a string, to an integer
            int key = atoi(argument);

            // Prompt the user for the plain text
            string plaintext = get_string("plaintext: ");

            // Encipher it
            printf("ciphertext: ");
            for (int i = 0; i < strlen(plaintext); i++)
            {
                // The character at the index we are analyzing
                char p = plaintext[i];

                // Check if it's alpha
                if (isalpha(p))
                {
                    // If it's alpha, encipher it by shifting the character by key.
                    char enciphered_character;

                    int index = get_alpha_index(p);
                    int offset = index + key;
                    if (offset > 25)
                    {
                        int rolled_offset = offset % 26;
                        enciphered_character = ALPHABET[rolled_offset];
                    }
                    else
                    {
                        enciphered_character = ALPHABET[offset];
                    }

                    // Preserve the case
                    // - We just convert it to uppercase if necessary, because the ALPHABET lookup string we use, is made of lowercase letters,
                    //   hence why we don't need to use 'tolower'.
                    if (isupper(p))
                    {
                        enciphered_character = toupper(enciphered_character);
                    }
                    printf("%c", enciphered_character);
                }
                else
                {
                    // Preserve any non-alphabetical characters
                    printf("%c", p);
                }
            }

            printf("\n");
        }
    }
    return 0;
}

/*
 * Function: is_number
 * ----------------------------
 *   Returns whether or not the provided string is a valid number
 *
 *   str: the string to check
 *
 *   returns: true if the provided string is a number, otherwise false
 */
bool is_number(string str)
{
    bool is = true;
    for (int i = 0; i < strlen(str); i++)
    {
        char c = str[i];
        if (!isdigit(c))
        {
            is = false;
            break;
        }
    }
    return is;
}

/*
 * Function: get_alpha_index
 * ----------------------------
 *   Returns the alphabetical index of the provided character, or -1 if the character is not alphabetical.
 *
 *   c: the character which we want it's alphabetical index
 *
 *   examples: get_alpha_index('a') = 0
 *             get_alpha_index('b') = 1
 *             get_alpha_index('z') = 25
 *
 *   returns: a number between 0 to 25 representing the alphabetical index of the provided character.
 *      if the provided character is not of type alpha, -1 will be returned instead.
 */
int get_alpha_index(char c)
{
    int index = -1;
    for (int i = 0; i < 26; i++)
    {
        if (tolower(c) == ALPHABET[i])
        {
            index = i;
            break;
        }
    }
    return index;
}