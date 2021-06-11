#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef uint8_t BYTE;

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        printf("Usage: ./recover image\n");
        return 1;
    }

    char *image_filename = argv[1];
    FILE *file = fopen(image_filename, "r");
    if (file == NULL)
    {
        printf("The image file cannot be opened for reading.\n");
        return 1;
    }


    BYTE buffer[512];
    int images_found_count = 0;

    char *filename = malloc(8); // ###.jpg\0  - 8 characters including the terminating NULL (\0). That's why I allocated 8 bytes for it
    if (filename == NULL)
    {
        printf("Out of memory - Could not allocate memmory for a filename\n");
        return 2;
    }
    FILE *outfile = NULL;

    // Read each block of 512 bytes, and check if it's the start of a JPEG file
    while (fread(buffer, sizeof(BYTE), 512, file))
    {
        // Check if this block is a start of a JPEG file
        if ((buffer[0] == 0xff) && (buffer[1] == 0xd8) && (buffer[2] == 0xff) && ((buffer[3] & 0xf0) == 0xe0))
        {
            // Found a new JPEG
            // Close the old JPEG file if any was open
            if (outfile != NULL)
            {
                fclose(outfile);
            }

            // Create a new JPEG file with the number (and trailing zero's) as the file name. E.g: 001.jpg
            sprintf(filename, "%03i.jpg", images_found_count);
            outfile = fopen(filename, "w");
            fwrite(buffer, sizeof(BYTE), 512, outfile);
            images_found_count++;
        }
        else
        {
            // Not the start of a JPEG image. But might be in the middle of one
            if (outfile != NULL)
            {
                // If we have a file that is open, write to it!
                fwrite(buffer, sizeof(BYTE), 512, outfile);
            }
        }
    }


    // Clean up any memory allocation
    free(filename); // free the memory allocated for the output image filename.
    fclose(file); // close the input image file

    if (outfile != NULL)
    {
        // Close the last file that might be open
        fclose(outfile); // close the output image file
    }

    return 0;

}