#include <cs50.h>
#include <stdio.h>
#include <string.h>

// Max number of candidates
#define MAX 9

// preferences[i][j] is number of voters who prefer i over j
int preferences[MAX][MAX];

// locked[i][j] means i is locked in over j
bool locked[MAX][MAX];

// Each pair has a winner, loser
typedef struct
{
    int winner;
    int loser;
} pair;

// Array of candidates
string candidates[MAX];
pair pairs[MAX * (MAX - 1) / 2];

int pair_count;
int candidate_count;

// Function prototypes
bool vote(int rank, string name, int ranks[]);
void record_preferences(int ranks[]);
void add_pairs(void);
void sort_pairs(void);
void lock_pairs(void);
void print_winner(void);

int main(int argc, string argv[])
{
    // Check for invalid usage
    if (argc < 2)
    {
        printf("Usage: tideman [candidate ...]\n");
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
        candidates[i] = argv[i + 1];
    }

    // Clear graph of locked in pairs
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = 0; j < candidate_count; j++)
        {
            locked[i][j] = false;
        }
    }

    pair_count = 0;
    int voter_count = get_int("Number of voters: ");

    // Query for votes
    for (int i = 0; i < voter_count; i++)
    {
        // ranks[i] is voter's ith preference
        int ranks[candidate_count];

        // Query for each rank
        for (int j = 0; j < candidate_count; j++)
        {
            string name = get_string("Rank %i: ", j + 1);

            if (!vote(j, name, ranks))
            {
                printf("Invalid vote.\n");
                return 3;
            }
        }

        record_preferences(ranks);

        printf("\n");
    }

    add_pairs();
    sort_pairs();
    lock_pairs();
    print_winner();
    return 0;
}

// Update ranks given a new vote
bool vote(int rank, string name, int ranks[])
{
    // Make sure that the candidate we are voting is valid
    for (int i = 0; i < candidate_count; i++)
    {
        if (strcmp(name, candidates[i]) == 0)
        {
            // Record the rank for this candidate
            ranks[rank] = i;
            return true;
        }
    }

    // If no candidate is found
    return false;
}

// Update preferences given one voter's ranks
void record_preferences(int ranks[])
{
    // preferences[i][j] => number of voters who prefer candidate [i] over candidate [j]
    for (int i = 0; i < candidate_count - 1; i++)
    {
        for (int j = i + 1; j < candidate_count; j++)
        {
            preferences[ranks[i]][ranks[j]] += 1;
        }
    }
}

// Record pairs of candidates where one is preferred over the other
void add_pairs(void)
{
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = i + 1; j < candidate_count; j++)
        {
            // Compare this pair: [i][j] and [j][i] are same!
            // then add that pair to the pairs list (if not a tie)
            // and also increment the pair_count (if the pair was added obv.)

            int num__i_over_j = preferences[i][j];
            int num__j_over_i = preferences[j][i];

            if (num__i_over_j > num__j_over_i)
            {
                // More votes for [i] over [j]
                pairs[pair_count].winner = i;
                pairs[pair_count].loser = j;

                pair_count += 1;
            }
            else if (num__i_over_j < num__j_over_i)
            {
                // More votes for [j] over [i]
                pairs[pair_count].winner = j;
                pairs[pair_count].loser = i;

                pair_count += 1;
            }
            // else
            // {
            // It's a tie!!
            // Meaning that the number of voters that prefer [i] over [j] are
            // equal to the number of voters of prefer [j] over [i]

            // do not add it to the pairs list!
            // }
        }
    }
}

// Sort pairs in decreasing order by strength of victory
void sort_pairs(void)
{
    // For all of the pairs, sort them by the number of preference for the winner, in decreasing order
    for (int i = 0; i < pair_count - 1; i++)
    {
        for (int j = i + 1; j < pair_count; j++)
        {
            int num_pref = preferences[pairs[i].winner][pairs[i].loser];
            int next_num_pref = preferences[pairs[j].winner][pairs[j].loser];

            if (next_num_pref > num_pref)
            {
                // Switch
                pair pj = pairs[j];
                pairs[j] = pairs[i];
                pairs[i] = pj;
            }
        }
    }
}

// A helper function to check if the candidate that is being connected (connectedIndex) cycles back to the originalCandidate
bool checkIfCycles(int connectedIndex, int originalCandidate)
{
    § if (connectedIndex == originalCandidate)
    {
        return true;
    }

    for (int i = 0; i < candidate_count; i++)
    {
        if (locked[connectedIndex][i])
        {
            // There is a connection from the .loser to someone else
            // now explore ther connection from that someone else (as the loser) to another person!! and so on...
            bool doesCycle = checkIfCycles(i, originalCandidate);
            if (doesCycle)
            {
                return true;
            }
        }
    }
    return false;
}

// Lock pairs into the candidate graph in order, without creating cycles
void lock_pairs(void)
{
    for (int i = 0; i < pair_count; i++)
    {
        pair pair = pairs[i];
        if (i == 0)
        {
            // You may lock the first pair in, because obviously it won't cycle!
            locked[pair.winner][pair.loser] = true;
        }
        else
        {
            bool doesCycle = checkIfCycles(pair.loser, pair.winner);
            if (doesCycle)
            {
                // Do not lock this pair! Because it cycles!
                locked[pair.winner][pair.loser] = false;
            }
            else
            {
                // This pair is safe to be locked in, 'cause it doesn't cycle
                locked[pair.winner][pair.loser] = true;
            }
        }
    }
}

// Print the winner of the election
void print_winner(void)
{
    for (int x = 0; x < candidate_count; x++)
    {
        bool colContainsTrue = false;
        for (int y = 0; y < candidate_count; y++)
        {
            if (locked[y][x])
            {
                colContainsTrue = true;
            }
        }

        if (!colContainsTrue)
        {
            printf("%s\n", candidates[x]);
        }
    }
}
