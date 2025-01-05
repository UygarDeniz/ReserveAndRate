from django.contrib import admin
from .models import BusinessHours, BlockedDate, TimeSlot, Reservation

admin.site.register(BusinessHours)
admin.site.register(BlockedDate)
admin.site.register(TimeSlot)
admin.site.register(Reservation)

