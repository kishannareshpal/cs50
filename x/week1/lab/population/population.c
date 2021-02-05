#include <cs50.h>
#include <stdio.h>

/**
 * Prompts user for an int that is greater than or equal to the min,
 * else the user is prompted to retry.
 */
int get_int_with_min(string promptText, int min)
{
    int val;
    do
    {
        // Prompt until input value is greater than or equal
        // to min.
        val = get_int("%s", promptText);
    }
    while (val < min);
    return val;
}


int main(void)
{
    // Prompt for start size (should be more than, or equal to 9)
    long start_size = get_int_with_min("Start size: ", 9);

    // Prompt for end size (should be more than the start_size)
    long end_size = get_int_with_min("End size: ", start_size);

    // Calculate number of years until we reach threshold
    long total = start_size;
    int years = 0;

    while (total < end_size)
    {
        // Say we have a population of n llamas.
        // Each year, n / 3 new llamas are born, and n / 4 llamas pass away.
        total = total + (total / 3) - (total / 4);
        years++;
    };

    // Print number of years
    printf("Years: %li\n", years);
}