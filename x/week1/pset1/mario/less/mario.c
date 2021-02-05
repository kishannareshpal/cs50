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


    // Draw the half-pyramid
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < height; j++)
        {
            if (((height - 1) - j) <= i)
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