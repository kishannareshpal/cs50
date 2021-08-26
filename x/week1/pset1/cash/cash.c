#include <cs50.h>
#include <stdio.h>
#include <math.h>

int main(void)
{
    // Prompt user for change
    float change;
    do
    {
        change = get_float("Change owed: ");
    }
    while (change < 0);

    // Greedy algorithm
    // Convert dollars to cents to avoid floating point tiny errors.
    int owed = round(change * 100);
    // Keep track of the number of coins being given.
    int nr_coins = 0;

    while (owed > 0)
    {
        // Possible coins are: ¢25, ¢10, ¢5 and ¢1.
        if (owed >= 25)
        {
            // give one quarter (¢25)
            owed -= 25;

        }
        else if (owed >= 10)
        {
            // give one dime (¢10)
            owed -= 10;

        }
        else if (owed >= 5)
        {
            // give one nickel (¢5)
            owed -= 5;

        }
        else
        {
            // give one penny (¢1)
            owed -= 1;
        }
        nr_coins++;
    }

    // Print out the number of coins
    printf("%i\n", nr_coins);
}