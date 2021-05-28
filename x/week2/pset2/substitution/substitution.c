#include <cs50.h>
#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

string ALPHABET = "abcdefghijklmnopqrstuvwxyz";

bool is_key_alpha(string word);
int get_alpha_index(char c);
bool does_key_contain_uniq_chars(string key);

int main(int argc, string argv[])
{
    if (argc != 2)
    {
        // Must have one argument only
        printf("Usage: ./substitution key\n");
        return 1;
    }
    else
    {
        // Grab the argument, which is the key to the cipher (the substitute for the alphabet)
        string key = argv[1];
        if (!is_key_alpha(key) || !does_key_contain_uniq_chars(key))
        {
            // The key must only contain alpha characters
            printf("Usage: ./substitution key\n");
            return 1;
        }
        else if (strlen(argv[1]) != 26)
        {
            // The key must also, only contain, 26 characters (which is the length of the alphabet system)
            printf("Key must contain 26 characters.\n");
            return 1;
        }
        else
        {
            // Prompt the user for the plain text
            string plaintext = get_string("plaintext: ");
            printf("ciphertext: ");

            // Encipher it by grabbing each character, and encipher it if applicable.
            for (int i = 0; i < strlen(plaintext); i++)
            {
                char p = plaintext[i];
                if (isalpha(p))
                {
                    // Encipher it by subsituting with the same alpha index, by the key
                    int index = get_alpha_index(p);
                    char c = key[index];

                    // Preserve case
                    if (isupper(p))
                    {
                        // If the original character was uppercase,
                        // change the case of the enciphered character to be uppercase as well
                        c = toupper(c);
                    }
                    else
                    {
                        // If the original character was lowercase,
                        // change the case of the enciphered character to be lowercase as well
                        c = tolower(c);
                    }
                    printf("%c", c);
                }
                else
                {
                    // Preserve non-alpha characters
                    printf("%c", p);
                }
            }
            printf("\n");
        }
    }
    return 0;
}

/*
 * Function: is_key_alpha
 * ----------------------------
 *   Returns whether or not a string is made only of alpha characters and contains unique chars.
 *
 *   word: the string word to check
 *
 *   returns: true if the string contains only alpha characters,
 *      otherwise false, if it contains any non-alpha character
 */
bool is_key_alpha(string key)
{
    bool valid = true;
    char analyzed[strlen(key)];
    for (int i = 0; i < strlen(key); i++)
    {
        if (!isalpha(key[i]))
        {
            // Contains a non-alpha char
            valid = false;
            break;
        }
    }
    return valid;
}

bool does_key_contain_uniq_chars(string key)
{
    bool itdoes = true;
    for (int i = 0; i < strlen(key); i++)
    {
        for (int j = i + 1; j < strlen(key); j++)
        {
            if (key[i] == key[j])
            {
                return false;
            }
        }
    }
    return true;
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