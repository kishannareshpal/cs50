#include <cs50.h>
#include <stdio.h>

int main(void)
{
    // Prompt user for name
    string name = get_string("What's your name? ");
    // Display their name
    printf("hello, %s\n", name);
}