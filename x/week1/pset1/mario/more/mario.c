#include <cs50.h>
#include <stdio.h>

int main(void)
{
    // Prompt the user for the height
    int height;
    do
    {
        height = get_int("What's the height? ");
    }
    while (!(height > 0 && height <= 8));


    // Draw the pyramid – mirrored
    for (int row = 0; row < height; row++)
    {
        // Print blocks from right-to-left.
        for (int col = 0; col < height; col++)
        {
            if (height - col <= row + 1)
            {
                printf("#");
            }
            else
            {
                printf(" ");
            }
        }

        // Print the 2 space gap.
        printf("  ");

        // Print blocks from left-to-right.
        for (int col = 0; col < height; col++)
        {
            if (col <= row)
            {
                printf("#");
            }
        }

        // Move to new line
        printf("\n");
        // Repeat!
    }
}