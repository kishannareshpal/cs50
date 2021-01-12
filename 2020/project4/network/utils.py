from django.core.paginator import EmptyPage

def try_or_none(function):
    try:
        return function()

    except:
        return None;