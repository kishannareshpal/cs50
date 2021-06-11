# [Week 4](../../) / Problem Set 4

### Filter (Less Comfortable)

A program that applies filters to BMPs.

> The difference between the [More comfortable](../more) and this versions of the program, is the implementation of:
>
> -   (Less) **Sepia filter**
> -   (More) **Edge detection filter** (using the [Sobel Operator](https://en.wikipedia.org/wiki/Sobel_operator))

[🔗 Read more about the problem](https://cs50.harvard.edu/x/2021/psets/4/filter/less)

##### Requirements

Implement the functions in `helpers.c` such that a user can apply `grayscale`, `sepia`, `reflection`, or `blur` filters to their images.

:white_check_mark: The function `grayscale` should take an image and turn it into a black-and-white version of the same image.\
:white_check_mark: The function `sepia` should take an image and turn it into a sepia version of the same image.\
:white_check_mark: The `reflect` function should take an image and reflect it horizontally.\
:white_check_mark: The `blur` function should take an image and turn it into a box-blurred version of the same image.\
:white_check_mark: You should not modify any of the function signatures, nor should you modify any other files other than `helpers.c`.

##### Examples

```bash
# Takes the images/yard.bmp file and generates a new out.bmp file with the grayscale filter on it.
$ ./filter -g images/yard.bmp out.bmp

# Generate a new image out of the original, with the sepia filter
$ ./filter -s images/tower.bmp out.bmp

# # Generate a new image out of the original, with the reflection filter
$ ./filter -r images/stadium.bmp out.bmp

# # Generate a new image out of the original, with the box blur filter
$ ./filter -b images/courtyard.bmp out.bmp
```

##### Usage

```bash
# Compile
$ make filter
# Execute
$ ./filter [-r|-s|-g|-b] infile outfile
```
