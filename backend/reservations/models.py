from django.db import models
from django.core.exceptions import ValidationError
from restaurants.models import Restaurant

DAY_CHOICES = [
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday'),
]


class BusinessHours(models.Model):
    """
    Days and time intervals the restaurant is open.
    """
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")

    def __str__(self):
        return f"{self.restaurant} - {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"


class BlockedDate(models.Model):
    """
    Specific days the restaurant is not available or fully blocked.
    """
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    date = models.DateField()
    reason = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.restaurant} blocked on {self.date}: {self.reason}"


class TimeSlot(models.Model):
    """
    Represents a date/time segment with capacity.
    """
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_bookings = models.IntegerField(default=1)
    current_bookings = models.IntegerField(default=0)

    class Meta:
        ordering = ['date', 'start_time']

    @property
    def is_fully_booked(self):
        return self.current_bookings >= self.max_bookings

    def clean(self):
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")
        if self.max_bookings < 1:
            raise ValidationError("Maximum bookings must be at least 1")

    def __str__(self):
        return f"{self.restaurant} {self.date} {self.start_time}-{self.end_time} ({self.current_bookings}/{self.max_bookings})"


class Reservation(models.Model):
    """
    A user's booking for a particular timeslot.
    """
    time_slot = models.ForeignKey(
        TimeSlot, on_delete=models.CASCADE, related_name='reservation')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    special_request = models.TextField(blank=True)
    guests = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.time_slot and self.time_slot.is_fully_booked:
            raise ValidationError("Time slot is fully booked")
        if self.guests and self.guests < 1:
            raise ValidationError("Number of guests must be at least 1")
        if self.guests and self.guests > self.time_slot.restaurant.max_number_of_guests:
            raise ValidationError("Number of guests exceeds maximum allowed")

    def save(self, *args, **kwargs):
        new_record = self.pk is None
        super().save(*args, **kwargs)
        if new_record:
            slot = self.time_slot
            slot.current_bookings += 1
            slot.save()

    def __str__(self):
        return f"{self.user} reserved {self.time_slot}"
