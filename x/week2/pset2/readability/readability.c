#include <cs50.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <math.h>

int main(void)
{
    // Prompt the user for the text to be analyzed
    string text = get_string("Text: ");

    // Count the number of letters, words and sentences from the text
    int num_letters = 0, num_words = 1, num_sentences = 0;

    for (int i = 0; i < strlen(text); i++)
    {
        char character = text[i];

        if (isalpha(character))
        {
            num_letters += 1;
        }
        else if (isspace(character))
        {
            num_words += 1;
        }
        else if (character == '.' || character == '!' || character == '?')
        {
            num_sentences += 1;
        }
    }

    // Apply the Coleman-Liau formula for readability test:
    //  index = 0.0588 * L - 0.296 * S - 15.8
    //      Where:
    //       L -> is the average number of letters per 100 words in the text
    //       S -> is the average number of sentences per 100 words in the text

    // Determine the (L) average number of letters per 100 words in the text
    //  num_letters -> num_words
    //  L           -> 100
    //  L * num_words = num_letters * 100
    //  L = num_letters * 100 / num_words
    float l = num_letters * 100.0 / num_words; // i put 100.0 so that the entire operation returns me a float.

    // Determine the (S) average number of sentences per 100 words in the text
    //  num_sentences -> num_words
    //  S             -> 100
    //  S * num_words = num_sentences * 100
    //  S = num_sentences * 100 / num_words
    float s = num_sentences * 100.0 / num_words; // i put 100.0 so that the entire operation returns me a float.

    // Plug it into the formula
    float index = 0.0588 * l - 0.296 * s - 15.8;
    // Get the grade, by rounding the index to the nearest whole number
    const int grade = round(index);

    // And finally print it!
    if (grade < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (grade >= 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", grade);
    }
}