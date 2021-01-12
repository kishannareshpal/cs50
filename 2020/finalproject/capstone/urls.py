
from os import name
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),

    # API's
    path("api/login", views.user_login, name="login"),
    path("api/register", views.user_register, name="register"),
    path("api/logout", views.user_logout, name="logout"),
    path("api/users", views.users, name="users"),

    path("api/services", views.services, name="services"),
    path("api/businesshours", views.businesshours, name="businesshours"),
    path("api/barbers", views.barbers, name="barbers"),

    path("api/bookings", views.bookings, name="bookings_all"),
    path("api/bookings/update", views.update_bookings, name="bookings_cancel"),
    path("api/profile/bookings", views.profile_bookings, name="bookings_profile"),


]
