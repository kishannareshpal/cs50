#include <ctype.h>
#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

// Points assigned to each letter of the alphabet
const int ALPHABET_LENGTH = 26;
string ALPHABET = "abcdefghijklmnopqrstuvwxyz";
int POINTS[ALPHABET_LENGTH] = {1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10};

int compute_score(string word);

int main(void)
{
    // Get input words from both players
    string word1 = get_string("Player 1: ");
    string word2 = get_string("Player 2: ");

    // Score both words
    int score1 = compute_score(word1);
    int score2 = compute_score(word2);

    // Display the winner
    if (score1 == score2)
    {
        printf("Tie!\n");

        // Debug
        // printf("Tie, both with %i - %i points", score1, score2);
    }
    else if (score1 > score2)
    {
        printf("Player 1 wins!\n");

        // Debug
        // printf("Player 1 wins, with %i points\n", score1);
        // printf("Player 2 loses with %i points", score2);
    }
    else
    {
        printf("Player 2 wins!\n");
        // Debug
        // printf("Player 2 wins, with %i points\n", score2);
        // printf("Player 1 loses with %i points", score1);
    }
}

/*
 * Function:  get_letter_index
 * --------------------
 * returns the index (0 based position) of the letter in alphabet:
 *      a=0, b=1, c=2, etc...
 *
 *  letter: the letter character
 *
 *  returns: the 0 indexed position of the letter
 *           or -1 if the provided letter char is not a character from the alphabet
 */
int get_letter_index(char letter)
{
    // Normalize the letter, by transforming it into lowercase
    // so we can lookup with our ALPHABET array
    char loweredLetter = tolower(letter);

    int index = -1; // the index to be returned
    for (int i = 0; i < ALPHABET_LENGTH; i++)
    {
        // Check the currently scanning character's position
        char currentScanningLetter = ALPHABET[i];
        if (loweredLetter == currentScanningLetter)
        {
            index = i;
            break;
        }
    }

    // return the 0-indexed position of the letter
    return index;
}

/*
 * Function:  compute_score
 * --------------------
 * returns the scrabble score, which is the sum of the point values of each letter in the word
 *      the points are defined in the POINTS array.
 *
 *  word: the word of which we want the score
 *
 *  returns: the score
 */
int compute_score(string word)
{
    int score = 0;
    for (int i = 0; i < strlen(word); i++)
    {
        const char letter = word[i];
        const int letterIndex = get_letter_index(letter);

        if (letterIndex != -1)
        {
            const int letterPoint = POINTS[letterIndex];
            score += letterPoint;
        }
    }
    return score;
}