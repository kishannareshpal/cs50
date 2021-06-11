// Modifies the volume of an audio file

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

// Number of bytes in .wav header
const int HEADER_SIZE = 44;

// Function headers
void copy_header(FILE *input, FILE *output);
void change_volume(FILE *input, FILE *output, float factor);

int main(int argc, char *argv[])
{
    // Check command-line arguments
    if (argc != 4)
    {
        printf("Usage: ./volume input.wav output.wav factor\n");
        return 1;
    }

    // Open files and determine scaling factor
    FILE *input = fopen(argv[1], "r");
    if (input == NULL)
    {
        printf("Could not open file.\n");
        return 1;
    }

    FILE *output = fopen(argv[2], "w");
    if (output == NULL)
    {
        // Close the input file before ending the program to prevent memory leak
        fclose(input);
        printf("Could not open file.\n");
        return 1;
    }

    float factor = atof(argv[3]);

    // TODO: Copy header from input file to output file
    copy_header(input, output);

    // TODO: Read samples from input file and write updated data to output file
    change_volume(input, output, factor);

    // Close files
    fclose(input);
    fclose(output);
}


/**
 * Copies the header of the WAV file from the input, to the output.
 * - The header, is the first 44 bytes of the WAV file.
 */
void copy_header(FILE *input, FILE *output)
{
    // Read the first 44 bytes of the input WAV file
    uint8_t buffer[HEADER_SIZE];
    /* Note (1/2)
        - Why are we passing the "buffer" array directly to the "fread" (knowing that the first argument takes a pointer instead).
        - That is, because any array variable is implicitly an address to the first el of the array, hence it's fine!
    */
    fread(buffer, sizeof(uint8_t), HEADER_SIZE, input);

    // Then copy them into the output file as they are!
    fwrite(buffer, sizeof(uint8_t), HEADER_SIZE, output);
}


/**
 * Change the volume of the input WAV file by the factor amount, and save it into the output
 */
void change_volume(FILE *input, FILE *output, float factor)
{
    int16_t buffer;
    /* Note (2/2)
        - Here, because "buffer" is not an array, we need to explicitly pass it's address (pointer) with the ampersand symbol.
    */
    while (fread(&buffer, sizeof(int16_t), 1, input))
    {
        buffer *= factor;
        fwrite(&buffer, sizeof(int16_t), 1, output);
    }
}
