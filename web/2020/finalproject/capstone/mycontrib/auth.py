from capstone.models import User
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.db.models import Q


class EmailBackend(ModelBackend):
    """
    A custom authentication backend so I can use email to login, instead of only using usernames.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        print("me??")
        try:
            # Gets the user via email or username.
            user = User.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
            if user.check_password(password):
                return user
                
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a non-existing user (#20760).
            User().set_password(password)
            return None
        return None