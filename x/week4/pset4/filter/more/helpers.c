#include <math.h>
#include "helpers.h"

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            RGBTRIPLE pixel = image[y][x];

            // Calculate the average color from all the RGB component's of this pixel
            int avg = round((pixel.rgbtRed + pixel.rgbtGreen + pixel.rgbtBlue) / 3.0);
            image[y][x].rgbtRed = avg;
            image[y][x].rgbtGreen = avg;
            image[y][x].rgbtBlue = avg;
        }
    }
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

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    // Copy the pixels from the original image, so I can refer to the colors of this copy and directly modify the original's pixels
    RGBTRIPLE originalImage[height][width];
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
    return;
}

// Detect edges (using the Sobel-Feldman Edge Detection algorithm)
void edges(int height, int width, RGBTRIPLE image[height][width])
{

    // Copy the pixels from the original image, so I can refer to the colors of this copy and directly modify the original's pixels
    RGBTRIPLE originalImage[height][width];
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            originalImage[i][j] = image[i][j];
        }
    }


    // Offsets for the surrounding pixels from the original one.
    int offsets[3] = {-1, 0, +1};

    // Sobel-Operator kernels
    const int gxKernel[3][3] =
    {
        {-1, 0, 1},
        {-2, 0, 2},
        {-1, 0, 1}
    };

    const int gyKernel[3][3] =
    {
        {-1, -2, -1},
        {0, 0, 0},
        {1, 2, 1}
    };

    // For each pixel ...
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {

            // x
            int gxRed = 0;
            int gxGreen = 0;
            int gxBlue = 0;
            // y
            int gyRed = 0;
            int gyGreen = 0;
            int gyBlue = 0;

            // ... check the surrounding pixels
            for (int oy = 0; oy < 3; oy++)
            {
                for (int ox = 0; ox < 3; ox++)
                {
                    int offsetX = x + offsets[ox];
                    int offsetY = y + offsets[oy];

                    // Make sure that the offset doesn't go out of bound! Including the original pixel.
                    if ((offsetX >= 0 && offsetX < width) && (offsetY >= 0 && offsetY < height))
                    {

                        // Get the pixel at this offset
                        RGBTRIPLE pixelAtOffset = originalImage[offsetY][offsetX];
                        gxRed += (gxKernel[oy][ox] * pixelAtOffset.rgbtRed);
                        gxGreen += (gxKernel[oy][ox] * pixelAtOffset.rgbtGreen);
                        gxBlue += (gxKernel[oy][ox] * pixelAtOffset.rgbtBlue);

                        gyRed += (gyKernel[oy][ox] * pixelAtOffset.rgbtRed);
                        gyGreen += (gyKernel[oy][ox] * pixelAtOffset.rgbtGreen);
                        gyBlue += (gyKernel[oy][ox] * pixelAtOffset.rgbtBlue);

                    }
                }
            }

            float red = round(sqrtf(pow(gxRed, 2) + pow(gyRed, 2)));
            float green = round(sqrtf(pow(gxGreen, 2) + pow(gyGreen, 2)));
            float blue = round(sqrtf(pow(gxBlue, 2) + pow(gyBlue, 2)));

            image[y][x].rgbtRed = red > 255 ? 255 : red;
            image[y][x].rgbtGreen = green > 255 ? 255 : green;
            image[y][x].rgbtBlue = blue > 255 ? 255 : blue;
        }
    }

    return;
}
