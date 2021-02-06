#include <cs50.h>
#include <stdio.h>
#include <math.h>
#include <string.h>

/**
 * Returns the length of any positive long number.
 */
int getLongLength(long number)
{
    // To get the length of a positive long number
    // we use the log base 10 of the number to get the power of 10 to reach given long number

    // Explanation
    // –––––––––––
    // The log10 of the number is how many times I can multiply 10 to reach the number.
    // E.g: log10(4300) which is 10^(x) = 4300 –– would evaluate x=3.63
    // Now we floor the x by casting the x to an Integer (eliminating the .63 remainder).
    // E.g: 10^3 = 1000
    // We will have 3 which is the amount of 0, then we add +1. And that will be our length.
    return log10(number) + 1;
}


/**
 * Returns the first two digits of the given number
 * @param {int} nDigits – the number of digits to return. Must be less than or equal to the provided (@param lenOfNumber).
 * @param {long} number – the given full number.
 * @param {long} lenOfNumber - the length of the @param number.
 *
 * @see getLength() on how to get a length of any positive long number.
 * @returns the first n digits of the given (@param number).
 *          Or if (@param nDigits) is more than the (@param lenOfNumber), will return -1 (which means invalid).
 */
int getNDigits(int nDigits, long number, long lenOfNumber)
{
    if (nDigits > lenOfNumber)
    {
        // Not possible to get more digits than the actual number has.
        return -1;
    }

    // Return the first n digits of the given number.
    int ftd = (number / pow(10, lenOfNumber - nDigits));
    return ftd;
}


/**
 * Validates a credit card number using Luhns algorithm.
 * @param {long} number the number of the card to check
 * @returns {bool} true if valid, otherwise false.
 */
void checkCard(long number)
{
    int length = getLongLength(number);
    int first_digit = getNDigits(1, number, length);
    int first_two_digits = getNDigits(2, number, length);

    // Now according to the format of card herein, check the
    // card issuer.
    string issuer;
    if (length == 15)
    {
        // American Express or AMEX
        // First 2 digits should be either 34 or 37
        if (first_two_digits == 34 || first_two_digits == 37)
        {
            issuer = "AMEX";
        }
        else
        {
            issuer = "INVALID";
        }
    }
    else if (length == 13)
    {
        // VISA
        // First digit should be either 4
        if (first_digit == 4)
        {
            issuer = "VISA";
        }
        else
        {
            issuer = "INVALID";
        }
    }
    else if (length == 16)
    {
        // VISA OR MASTERCARD
        if (first_digit == 4)
        {
            issuer = "VISA";
        }
        else if (first_two_digits == 51
                 || first_two_digits == 52
                 || first_two_digits == 53
                 || first_two_digits == 54
                 || first_two_digits == 55)
        {
            issuer = "MASTERCARD";

        }
        else
        {
            issuer = "INVALID";
        }
    }
    else
    {
        // Doesn't match any card format for any issuer.
        issuer = "INVALID";
    }


    // If the digits does not match any issuer format, end here
    // and print invalid.
    if (strcmp(issuer, "INVALID") == 0)
    {
        printf("%s\n", issuer);
        return;
    }


    // If the digits matches an issuer, continue to check the card's checksum.
    // Using Lughns Algorithm.``
    long multiplier = 1; // we can also use 10^(i) below which is pow(10, i)
    int sum_products = 0;
    int sum_other = 0;

    for (int i = 0; i < length; i++)
    {
        // To get the last digit of a number, divide by 10 and
        // use the remainder. We can do this with the modulo operator.
        // –––––––––––––––––––––––
        // E.g: 12345 / 10 = 1234.5 (the remainder 5 is the last digit).
        // Now using the modulo operator in our code:
        // E.g: 12345 % 10 = 5 (which will return just the remainder 5).

        // Now assuming a starting number=12345 and a multiplier=1
        // We will divide the starting number by the multiplier, starting number length times and calculate it's modulo to get every digit starting from the far-end.
        // –––––––––––––––––––––––
        // E.g: 12345 / 1 = 12345
        // * The modulo of the result will be it's last digit (5).
        // * Continuing, multiply our prev multiplier by 10 (multiplier * 10) and we will now have:
        // E.g: 12345 / 10 = 1234.5
        // Which will give as a floating point number, and if we cast it into an (int) it will automatically omit the remainder:
        // E.g: (int) 1234.5 = 1234
        // So we can then grab the modulo of that number (1234 % 10 = 4) and we will have the last digit (4) which is the second last digit of the starting number (12345).
        // * repeat for however many times the length of the starting number is...

        int digit = (number / multiplier) % 10;

        int isOdd = i % 2 != 0;
        if (isOdd)
        {
            // Multiply every other digit, starting with the number’s second-to-last digit and add the products together:
            int product = (digit * 2);
            // Add the product digits (NOT THE PRODUCTS THEMSELVES)

            if (product >= 10)
            {
                // Got two digits or more.
                // add those individually together!
                int product_len = getLongLength(product);
                int product_individual_sum = 0;
                for (int p = 0; p < product_len; p++)
                {
                    int product_digit = (product / (int) pow(10, p)) % 10;
                    product_individual_sum += product_digit;
                }

                sum_products += product_individual_sum;
            }
            else
            {
                sum_products += product;
            }

        }
        else
        {
            // Sum the digits that weren’t multiplied by 2 (starting from the end):
            sum_other += digit;
        }

        // Increase multiplier by 10, so we can grab the next digit.
        multiplier *= 10;
    }


    // Add the products of the multiplied number (sum_products) with the sum of the not multiplied numbers (sum_other)
    int checksum = sum_products + sum_other;

    // Now verify the checksum's last digit.
    int last_digit_checksum = checksum % 10;

    if (last_digit_checksum == 0)
    {
        // Legit!
        printf("%s\n", issuer);
    }
    else
    {
        // Not a legit card!
        printf("%s\n", "INVALID");
    }
}


int main(void)
{
    // Get user's credit card card number
    long number = get_long("Number: ");
    // Check it!
    checkCard(number);

}