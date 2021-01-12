
/**
 * Simply validates any email address
 *
 * @param {String} email the email address to validate
 * @returns {Boolean} true if email is valid, otherwise false.
 */
const EmailValidator = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default EmailValidator;