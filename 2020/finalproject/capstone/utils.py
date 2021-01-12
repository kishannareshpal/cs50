from typing import Iterable
from django.core.paginator import EmptyPage
from itertools import groupby
from operator import itemgetter
from django.db.models.query import QuerySet
from six.moves import input
import datetime

def try_or_none(function):
    """
    Try executing a function that catches, and always return None if it catches.
    """
    try:
        return function()

    except:
        return None;



def group_query_by(serialized_list, getter_key):
    """
    https://stackoverflow.com/a/477839
    Group a queryset by key.
    
    Example:
        If you have:
            list = [
                {
                    type: "fruit",
                    name: "apple"
                },
                {
                    type: "fruit",
                    name: "pear"
                },
                {
                    type: "vegetable",
                    name: "cabbage"
                }
                {
                    type: "fruit",
                    name: "orange"
                },
                {
                    type: "fruit",
                    name: "grapefruit"
                },
                {
                    type: "vegetable",
                    name: "lettuce"
                },
                {
                    type: "fruit",
                    name: "plums"
                },
                {
                    type: "vegetable",
                    name: "onion"
                },
            ]

        grouped_list = group_query_by(list, key='type')
        
        You should do:
            >>> for _type, list in grouped_list:
            >>>     print(f'=== {type} ===')
            >>>     for item in list:
            >>>         print item
    """

    iter = groupby(sorted(serialized_list, key=getter_key), key=getter_key)
    return iter




def boolean_input(question, default=None):
    """
    Ask a simple confirmation for terminal
    - Used inside a custom command.
    """

    # Ask a question and wait for the user input
    result = input(f"{question} (y/n): ")
    
    if not result and default is not None:
        # If user did not answer just exit with None
        return default

    while len(result) < 1 or result[0].lower() not in "yn":
        # The response should begin with either a "y" or a "n"
        result = input("Please answer yes (y) or no (n): ")
    
    # If the user response begins with a "y", assume it as "yes" or True
    # Otherwise assume it as "no" or False, that is if the user's response began with an "n"
    return result[0].lower() == "y"



def str_to_time(str, default=None) -> datetime.time:
    """
    A utility function that converts time from string (format %H:%M) into datetime.time
    Returns default if str is empty.
    """
    if not str:
        return default
    return datetime.datetime.strptime(str, "%H:%M").time()