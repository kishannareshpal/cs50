import json

from django.db.models.query_utils import Q
from django.views.decorators import csrf
from capstone.models import Booking, BusinessHour, Service, User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import IntegrityError
from django.http.response import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls.base import reverse
from .utils import group_query_by
from datetime import datetime


def index(request):
    return render(request, "capstone/index.html")

# API's
@csrf_exempt
def user_login(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "message": "POST request required",
                "data": None
            },
            status=405
        )

    # Attempt to sign user in
    data = json.loads(request.body)
    email = data.get("email", None)
    password = data.get("password", None)

    user = authenticate(request=request, username=email, password=password)
    # Check if authentication is successful
    if user is None:
        return JsonResponse(
            {
                "message": "Invalid credentials",
                "data": None
            },
            status=404
        )

    login(request, user)
    return JsonResponse(
        {
            "message": "Logged in",
            "data": user.serialize()
        },
        status=200
    )



def user_logout(request):
    logout(request)
    return JsonResponse(
        {
            "message": "Logged out",
            "data": None,
        },
        status=200
    )



@csrf_exempt
def user_register(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "message": "POST request required",
                "data": None
            },
            status=405
        )

    # Attempt to sign up
    data = json.loads(request.body)
    first_name = data.get("first_name", None)
    last_name = data.get("last_name", None)
    email = data.get("email", None)
    password = data.get("password", None)

    # Attempt to create new user
    try:
        user = User.objects.create_user(email, password, first_name=first_name, last_name=last_name)

    except IntegrityError:
        return JsonResponse(
            {
                "message": "Email already registered",
                "data": None
            },
            status=403
        )

    login(request, user)
    return JsonResponse(
        {
            "message": "Registered & Logged in",
            "data": user.serialize()
        },
        status=200
    )



def users(request):
    user_email = request.GET.get('email', None)

    # Check if user exists
    if user_email:
        try:
            user = User.objects.get(email=user_email)
            return JsonResponse(
                {
                    "message": None,
                    "data": user.serialize()
                },
                status=200
            )

        except(User.DoesNotExist):
            return JsonResponse(
                {
                    "message": "User not found",
                    "data": None
                },
                status=404
            )

    return JsonResponse(
        {
            "message": "Invalid request. Email param is required",
            "data": None
        },
        status=400
    )



def services(request):
    """
    Retrieve all services
    """
    if request.method != "GET":
        return JsonResponse(
            {
                "message": "GET request required",
                "data": None
            },
            status=405
        )

    services = Service.objects.all()
    serialized_services = [service.serialize() for service in services]

    # group the services by type.
    grouped_services = group_query_by(serialized_services, getter_key=lambda x: x['type']['title'])
    data = []
    for servicetype, all_services in grouped_services:
        group = {
            "type": servicetype,
            "services": [service for service in all_services]
        }
        data.append(group)

    return JsonResponse(
        {
            "message": None,
            "meta": {
                "count": services.count()
            },
            "data": data
        },
        status=200
    )



def businesshours(request):
    if request.method != "GET":
        return JsonResponse(
            {
                "message": "GET request required",
                "data": None
            },
            status=405
        )

    businesshours = BusinessHour.objects.order_by('day').all()
    serialized_businesshours = [businesshour.serialize() for businesshour in businesshours]

    return JsonResponse(
        {
            "message": None,
            "data": serialized_businesshours
        },
        status=200
    )



@csrf_exempt
def bookings(request):
    # POST: Book an appointment
    if request.method == "POST":
        # Check if user is authenticated or not.
        if not request.user.is_authenticated:
            # User is not authenticated. Abort.
            return JsonResponse(
                {
                    "message": "Unauthorized",
                    "data": None
                },
                status=401
            )

        data = json.loads(request.body)
        service_id = data.get("service_id")
        barber_id = data.get("barber_id")
        barber = None

        # Query for requested post
        try:
            service = Service.objects.get(pk=service_id)

            if barber_id:
                barber = User.objects.get(pk=barber_id)

        except (Service.DoesNotExist, User.DoesNotExist):
            return JsonResponse(
                {
                    "message": "Service or Barber not found",
                    "data": None
                },
                status=404
            )

        note = data.get("note")
        date_string = data.get("date")
        time_string = data.get("time")

        try:
            date = datetime.strptime(date_string, "%d/%m/%Y").date()
            time = datetime.strptime(time_string, "%H:%M").time()
        except:
            # Date or time parse error
            return JsonResponse(
                {
                    "message": "Invalid date or time format. Please use DD/MM/YYYY for date and HH:mm for time",
                    "data": None
                },
                status=400
            )

        booking = Booking(
            service=service,
            barber=barber,
            date=date,
            time=time,
            note=note,
            user=request.user
        )
        booking.save()
        serialized_booking = booking.serialize() # serialize and return the newly created booking
        return JsonResponse(
            {
                "message": "Booked",
                "data": serialized_booking
            },
            status=201
        )

    # GET: get all bookings
    bookings_statement = Booking.objects;
    # Query by barber, date
    barber_id = request.GET.get('barber_id', None)
    date = request.GET.get('date', None)
    search_query = request.GET.get("search_query")

    if barber_id:
        bookings_statement = bookings_statement.filter(barber=barber_id);

    if date:
        try:
            date = datetime.strptime(date, "%d/%m/%Y")
            bookings_statement = bookings_statement.filter(date=date)

        except:
            return JsonResponse(
                {
                    "message": "Date format invalid. Expected 'DD/MM/YYYY'",
                    "date": None
                },
                status=400
            )

    if search_query:
        # search by number, barber's name, service, and notes.
        bookings_statement = bookings_statement.filter(
            Q(user__first_name__icontains=search_query) |
            Q(user__last_name__icontains=search_query) |
            Q(number__icontains=search_query) |
            Q(barber__first_name__icontains=search_query) |
            Q(barber__last_name__icontains=search_query) |
            Q(service__title__icontains=search_query) |
            Q(service__type__title__icontains=search_query) |
            Q(service__description__icontains=search_query) |
            Q(note__icontains=search_query)
        )

    bookings = bookings_statement.all()
    serialized_bookings = [booking.serialize() for booking in bookings]
    return JsonResponse(
        {
            "message": None,
            "data": serialized_bookings
        },
        status=200
    )



@csrf_exempt
def profile_bookings(request):
    # Only allow get request.
    if request.method != "GET":
        return JsonResponse(
            {
                "message": "GET request required",
                "data": None
            },
            status=405
        )

    if not request.user.is_authenticated:
        # User is not authenticated
        return JsonResponse(
            {
                "message": "Unauthorized",
                "data": None,
            },
            status=401
        )

    current_user = request.user
    bookings_statement = current_user.bookings;
    search_query = request.GET.get("search_query")

    if search_query:
        # search by number, barber's name, service, and notes.
        bookings_statement = bookings_statement.filter(
            Q(number__icontains=search_query) |
            Q(barber__first_name__icontains=search_query) |
            Q(barber__last_name__icontains=search_query) |
            Q(service__title__icontains=search_query) |
            Q(service__type__title__icontains=search_query) |
            Q(service__description__icontains=search_query) |
            Q(note__icontains=search_query),
            user=request.user
        )

    my_bookings = bookings_statement.order_by('-date').all()
    serialized_bookings = [booking.serialize() for booking in my_bookings]

    return JsonResponse(
        {
            "message": None,
            "data": serialized_bookings
        },
        status=200
    )



@csrf_exempt
def update_bookings(request):
    # Only allow post request.
    if request.method != "POST":
        return JsonResponse(
            {
                "message": "POST request required",
                "data": None
            },
            status=405
        )

    if not request.user.is_authenticated:
        # User is not authenticated
        return JsonResponse(
            {
                "message": "Unauthorized",
                "data": None,
            },
            status=401
        )

    # Retrieve the data (post_id and the current user)
    data = json.loads(request.body)
    booking_number = data.get("booking_number") # The booking you want to cancel
    new_status = data.get("status") # The status to update the booking to!


    # Check if a booking exists with the provided id.
    try:
        booking = Booking.objects.get(number=booking_number)
        # Booking exists!

        # Check if current user is allowed to update this booking
        # only allow the user who booked or a staff.
        if not ((booking.user == request.user) or request.user.is_staff):
            # Not the user who create the booking, nor a staff
            # Deny
            return JsonResponse(
                {
                    "message": "Forbidden",
                    "data": None
                },
                status=403
            )

        # Prevent updated if the status is already in done, canceled or rejected.
        if booking.status in (Booking.Status.DONE, Booking.Status.CANCELED, Booking.Status.REJECTED):
            return JsonResponse(
                {
                    "message": "Forbidden",
                    "data": None
                },
                status=403
            )

        booking.status = new_status
        booking.save()

        return JsonResponse(
            {
                "message": "Updated",
                "data": None
            },
            status=200
        )

    except Booking.DoesNotExist:
        # The booking with the provided id does not exist
        # or the currently logged in user does not have the rights of canceling it.
        return JsonResponse(
            {
                "message": "Not found",
                "data": None
            },
            status=404
        )



def barbers(request):
    # Only allow get request.
    if request.method != "GET":
        return JsonResponse(
            {
                "message": "GET request required",
                "data": None
            },
            status=405
        )

    barbers = User.objects.filter(is_barber=True).all()
    serialized_barbers = [barber.serialize() for barber in barbers]
    return JsonResponse(
        {
            "message": None,
            "data": serialized_barbers
        },
        status=200
    )
