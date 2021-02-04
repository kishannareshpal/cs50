
/**
 * Convert a date string into number.
 * Used for sorting (see 2nd link).
 * 
 * @see https://stackoverflow.com/questions/37996721/sort-an-array-of-strings-that-are-dates-javascript/37996911
 * @see https://stackoverflow.com/questions/5619202/converting-a-string-to-a-date-in-javascript
 * 
 * @example Converts date "26/06/2016" to 20160626
 * @param {String} date the date in DD/MM/YYYY format
 */
const dateToNum = (date) => {
    const d = date.split("/"); 
    return Number(d[2]+d[1]+d[0]);
};

export default dateToNum;