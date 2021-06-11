#include <stdio.h>
#include <math.h>
#include "helpers.h"

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            // To greyscale an image, we simply set the the individual pixel's rgb components to it's average.
            RGBTRIPLE pixel = image[y][x];
            // Calculate the average value between the pixel's red, green and blue components
            float bAndW_avg = (pixel.rgbtRed + pixel.rgbtGreen + pixel.rgbtBlue) / 3.0;
            int bAndW = round(bAndW_avg);

            // Set all of the color components of this pixel to the avg value calculated above.
            image[y][x].rgbtRed = bAndW;
            image[y][x].rgbtGreen = bAndW;
            image[y][x].rgbtBlue = bAndW;
        }
    }
    return;
}

// Convert image to sepia
void sepia(int height, int width, RGBTRIPLE image[height][width])
{
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            // To Sepia filter an image, we simply apply the Sepie formula for the individual pixel's rgb components.
            RGBTRIPLE pixel = image[y][x];
            // Apply the sepia formula
            int sepiaRed = round((0.393 * pixel.rgbtRed) + (0.769 * pixel.rgbtGreen) + (0.189 * pixel.rgbtBlue));
            int sepiaGreen = round((0.349 * pixel.rgbtRed) + (0.686 * pixel.rgbtGreen) + (0.168 * pixel.rgbtBlue));
            int sepiaBlue = round((0.272 * pixel.rgbtRed) + (0.534 * pixel.rgbtGreen) + (0.131 * pixel.rgbtBlue));

            // Set all of the color components of this pixel to the related sepia values that were calculated
            image[y][x].rgbtRed = sepiaRed > 255 ? 255 : sepiaRed; // cap to 255 maximum value.
            image[y][x].rgbtGreen = sepiaGreen > 255 ? 255 : sepiaGreen; // cap to 255 max value.
            image[y][x].rgbtBlue = sepiaBlue > 255 ? 255 : sepiaBlue; // cap to 255 maximum val.
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{

    // For each row like this:
    // [0][1][2][3][4][5][6]

    // Swap the symetrically positioned items, such as [0] & [6], [1] & [5], and so on..
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int n = (width - j) - 1; // the symetrical index for i, at the row
            if (n <= j)
            {
                // Stop swapping when reaches/surpasses the middle item (in this e.g. [3]!)
                // and begin the process on the next row... and so on
                break;
            }

            // Swap the symetrical pixel:
            // [i] & [(width - i) - 1]

            // E.g.: For a row with width 7 example for item at i = 0
            // [0] & [(7 - 0) - 1]
            // [0] & [6]
            RGBTRIPLE pixel = image[i][j];
            image[i][j] = image[i][n];
            image[i][n] = pixel;
        }
    }

    return;
}

// Blur image using the box blur technique
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    RGBTRIPLE originalImage[height][width];

    // Copy the pixels from the original image, so I can refer to the colors of this copy and directly modify the original's pixels
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            originalImage[i][j] = image[i][j];
        }
    }

    // Possible offsets from the original pixel location
    // - 1 row and column apart from the pixel. That is -1 and +1 from the index of the original pixel
    // Graphically, the offsets I'm getting from the loop bellow, are:
    /*
        (x-1, y-1)  (x, y-1)  (x+1, y-1)
        (x-1, y)    (x, y)    (x+1, y)
        (x-1, y+1)  (x, y+1)  (x+1, y+1)

        // The original pixel pixel is the center (x, y).
     */
    int offsets[3] = {-1, 0, +1};

    // Loop through each and every pixel
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            // For each pixel, calculate the avg. color for all the adjacent pixels.
            float adjacentPixelCount = 0.0;
            int ammountOfRed = 0;
            int ammountOfGreen = 0;
            int ammountOfBlue = 0;

            for (int oy = 0; oy < 3; oy++)
            {
                for (int ox = 0; ox < 3; ox++)
                {
                    int offsetX = x + offsets[ox];
                    int offsetY = y + offsets[oy];

                    // Make sure that the offset doesn't go out of bound! Including the original pixel.
                    if ((offsetX >= 0 && offsetX < width) && (offsetY >= 0 && offsetY < height))
                    {
                        RGBTRIPLE pixelAtOffset = originalImage[offsetY][offsetX];
                        ammountOfRed += pixelAtOffset.rgbtRed;
                        ammountOfGreen += pixelAtOffset.rgbtGreen;
                        ammountOfBlue += pixelAtOffset.rgbtBlue;

                        adjacentPixelCount++; // keep track of the number of pixels adjacent to the original one (incl. the original)
                    }
                }
            }

            // Determine the average RGB component's of all the adjacent pixels to the original one (including the original on the calculation)
            int avgRed = round(ammountOfRed / adjacentPixelCount);
            int avgGreen = round(ammountOfGreen / adjacentPixelCount);
            int avgBlue = round(ammountOfBlue / adjacentPixelCount);

            // Now set the RGB component's of the pixel at this location to the blur value
            image[y][x].rgbtRed = avgRed;
            image[y][x].rgbtGreen = avgGreen;
            image[y][x].rgbtBlue = avgBlue;
        }
    }


}
