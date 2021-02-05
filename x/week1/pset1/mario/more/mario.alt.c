#include <cs50.h>
#include <stdio.h>

/**
 * An alternative approach to the same Mario problem, in less lines.
 */ 
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
    for (int i = 0; i < height; i++)
    {
        int gap = 2;
        int maxColNumber = height * 2 + gap;
        for (int j = 0; j < maxColNumber ; j++)
        {
            int m = (height - j);
            if (m <= i + 1 && j <= maxColNumber - height + i && j != height  && j != height + 1)
            {
                // Draw the brick
                printf("#");
            }
            else
            {
                // Draw
                printf(" ");
            }
        }
        printf("\n");
    }
}