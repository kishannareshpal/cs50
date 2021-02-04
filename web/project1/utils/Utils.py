class Utils:
    @staticmethod
    def removeNegatives(list: list, include_zeros: bool = True, lessThan: int = None) -> list:
        """ Returns a new list without negative numbers
            If {include_zeros} is False, the list will not include 0, otherwise it will.
            - lessThan: should only contain numbers that are less than specified here.

            Example:
                list = [-4, -3, -2, 0, 1, 2, 4]
                output = [0, 1, 2, 4] if {include_zeros} is True
                output = [1, 2, 4] if {include_zeros} is False
        """

        if include_zeros:
            if lessThan:
                return [n for n in list if n >= 0 and n <= lessThan]
            else:
                return [n for n in list if n >= 0]
        else:
            if lessThan:
                return [n for n in list if n > 0 and n <= lessThan]
            else:
                return [n for n in list if n > 0]


    @staticmethod
    def diffList(list_one: list, list_two: list, includes_zeros: bool = True) -> list:
        """ Compares two lists, and returns a new list with items that are different on those lists\n
            Example:
                list_one  = [1, 2, 3, 4]
                list_two = [-1, 0, 1, 2, 3, 4]

                # with {includes_zeros} set to {True} (default)
                output = [-1, 0]
                
                # or with {includes_zeros} set to {False}
                output_no_zeros = [-1]
        """

        diff_list = list(set(list_one) - set(list_two))
        if not includes_zeros:
            diff_list = [x for x in diff_list if x != 0]
        return diff_list