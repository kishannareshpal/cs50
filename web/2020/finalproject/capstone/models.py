from django.contrib.auth.models import AbstractUser
from django.db import models
from .mycontrib.usermanager import CustomUserManager
import uuid


class User(AbstractUser):
    username = models.CharField(max_length=150, blank=True, null=True, default=None, unique=True)
    photo = models.ImageField(upload_to="staff/", null=True, blank=True)
    email = models.EmailField(blank=False, null=False, unique=True)
    is_barber = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "fullname": self.get_full_name(),
            "photo_url": self.photo.url if self.photo else None,
            "email": self.email,
            "is_barber": self.is_barber,
            "is_staff": self.is_staff
        }
        
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    objects = CustomUserManager()

    def __str__(self):
        return f"<{self.id}> {self.email}: {self.get_full_name()}"


class ServiceType(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"({self.id}) {self.title}"


class Service(models.Model):
    type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True, null=True)
    price_in_gbp = models.DecimalField(max_digits=5, decimal_places=2)
    duration_in_mins = models.IntegerField()

    def __str__(self):
        return f"({self.type.title}) {self.title} – {self.duration_in_mins}mins – £{self.price_in_gbp}"

    def serialize(self):
        return {
            "id": self.id,
            "type": {
                "id": self.type.id,
                "title": self.type.title
            },
            "title": self.title,
            "description": self.description,
            "price_in_gbp": self.price_in_gbp,
            "duration_in_mins": self.duration_in_mins
        }


class BusinessHour(models.Model):
    DAYS = (
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday', 
        'Thursday', 
        'Friday', 
        'Saturday'
    )

    class Weekday(models.IntegerChoices):
        SUNDAY = 0
        MONDAY = 1
        TUESDAY = 2
        WEDNESDAY = 3
        THURSDAY = 4
        FRIDAY = 5
        SATURDAY = 6
    
    day = models.IntegerField(choices=Weekday.choices)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "day": self.day,
            "day_name": self.DAYS[self.day],
            "opening_time": self.opening_time.strftime('%H:%M') if self.opening_time else None,
            "closing_time": self.closing_time.strftime('%H:%M') if self.closing_time else None
        }

    def __str__(self):
        day_name = self.DAYS[self.day]
        is_closed = ((self.opening_time == None) and (self.closing_time == None))
        return f"{day_name} – {'Closed' if is_closed else ('Open: ' + self.opening_time.strftime('%H:%M') + ' - Close: ' + self.closing_time.strftime('%H:%M'))}"


class Booking(models.Model):
    class Status(models.TextChoices):
        ACCEPTED = "accepted"
        DONE = "done"
        REJECTED = "rejected"
        CANCELED = "canceled"

    number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    barber = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True)
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(choices=Status.choices, max_length=12, default=Status.ACCEPTED)
    note = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, editable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.serialize(),
            "barber": self.barber.serialize(),
            "service": self.service.serialize(),
            "number": self.number,
            "date": self.date.strftime("%d/%m/%Y"),
            "time": self.time.strftime("%H:%M"),
            "status": self.status,
            "note": self.note,
            "timestamp": self.timestamp.strftime("%-I:%M %p · %b %-d, %Y")
        }

    def __str__(self):
        return f"<Status: {self.status}> {self.service.title} - ({self.time.strftime('%H:%M')}) ({self.date.strftime('%d/%m/%Y')})"