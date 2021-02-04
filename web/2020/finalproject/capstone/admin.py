from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(ServiceType)
admin.site.register(Service)
admin.site.register(BusinessHour)
admin.site.register(Booking)