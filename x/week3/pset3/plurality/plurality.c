#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

// Max number of candidates
#define MAX 9

// Candidates have name and vote count
typedef struct
{
    string name;
    int votes;
} candidate;

// Array of candidates
candidate candidates[MAX];

// Number of candidates
int candidate_count;

// Function prototypes
bool vote(string name);
void print_winner(void);

int main(int argc, string argv[])
{
    // Check for invalid usage
    if (argc < 2)
    {
        printf("Usage: plurality [candidate ...]\n");
        return 1;
    }

    // Populate array of candidates
    candidate_count = argc - 1;
    if (candidate_count > MAX)
    {
        printf("Maximum number of candidates is %i\n", MAX);
        return 2;
    }
    for (int i = 0; i < candidate_count; i++)
    {
        candidates[i].name = argv[i + 1];
        candidates[i].votes = 0;
    }

    int voter_count = get_int("Number of voters: ");

    // Loop over all voters
    for (int i = 0; i < voter_count; i++)
    {
        string name = get_string("Vote: ");

        // Check for invalid vote
        if (!vote(name))
        {
            printf("Invalid vote.\n");
        }
    }

    // Display winner of election
    print_winner();
}

// Update vote totals given a new vote
bool vote(string name)
{
    // Search the candidate we are voting for, in the candidates list
    for (int i = 0; i < candidate_count; i++)
    {
        if (strcmp(candidates[i].name, name) == 0)
        {
            // If a candidate with the name exists, increment his votes count
            candidates[i].votes++;
            return true;
        }
    }

    // Candidate with the provided name was not found.
    return false;
}

// Print the winner (or winners) of the election
void print_winner(void)
{
    // First sort the array in descending order - Selection Sort
    for (int i = 0; i < candidate_count - 1; i++)
    {
        for (int j = i + 1; j < candidate_count; j++)
        {
            if (candidates[j].votes > candidates[i].votes)
            {
                // Swap
                candidate c_with_most_votes = candidates[j];
                candidates[j] = candidates[i];
                candidates[i] = c_with_most_votes;
            }
        }
    }

    // Now that we have a sorted array, pick just the maximum values.
    // And print it/them as the winner(s)!
    int maximum = 0;
    for (int i = 0; i < candidate_count; i++)
    {
        if (candidates[i].votes >= maximum)
        {
            maximum = candidates[i].votes;
            printf("%s\n", candidates[i].name);
        }
        else
        {
            // The rest of the values (lesser than the maximum) are not needed.
            break;
        }
    }
}