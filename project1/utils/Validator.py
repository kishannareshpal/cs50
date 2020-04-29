import re

class Validator:

    @staticmethod
    def validate_username(username: str) -> bool:
        """ Validates username by these constraints:
                - not contain leading and trailing spaces
                - length between 3 to 16
                - should only contain combinations of letters and numbers
        """
        regex_lettersAndNumbersOnly = '^[a-zA-Z0-9]+$'

        length = len(username)

        valid_length = length >= 3 and length <= 16
        valid_alphanum = username.isalnum()

        return valid_length and valid_alphanum


    @staticmethod
    def validate_fullname(fullname: str) -> bool:
        """ Validates fullname by these constraints:
                - not contain leading and trailing spaces
                - lenght more than 1
                - should only contain letters
        """

        length = len(fullname)

        valid_length = length > 1
        valid_alphaWithSpace = fullname.replace(' ', '').isalpha()
        return valid_length and valid_alphaWithSpace



    @staticmethod
    def validate_email(email: str) -> bool:
        """ Validates email by these constraints:
                - not contain leading and trailing spaces
                - match email format
        """

        regex_email = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'

        valid_email = re.search(regex_email, email)
        return valid_email


    @staticmethod
    def validate_password(password: str) -> bool:
        """ Validates password by these constraints:
                - not contain leading and trailing spaces
                - length between 4 to 20
                - should only contain combinations of letters and numbers
        """

        length = len(password)

        valid_length = length >= 4 and length <= 20
        valid_alphanum = password.isalnum()
        return valid_length and valid_alphanum

    
    @staticmethod
    def validate_review_text(review_text: str) -> bool:
        """ Validates review text by these conditions:
                - length more than 0
        """

        length = len(review_text)
        valid_length = length > 0
        return valid_length