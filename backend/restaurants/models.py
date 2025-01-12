from django.utils import timezone
import uuid
from django.db import models


class Cuisine(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Restaurant(models.Model):
    user = models.OneToOneField(
        'users.User', on_delete=models.CASCADE, related_name='restaurant_profile')
    name = models.CharField(max_length=255)
    summary = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    city = models.ForeignKey(
        City, related_name='restaurants', on_delete=models.SET_NULL, null=True)
    full_address = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    opening_hours = models.CharField(max_length=20, null=True, blank=True)
    max_dinning_time = models.IntegerField(default=120, null=True, blank=True)
    price_start_from = models.IntegerField(default=0)
    min_number_of_guests = models.IntegerField(default=0)
    max_number_of_guests = models.IntegerField(default=0)
    image = models.ImageField(upload_to='restaurant_images/')
    cuisines = models.ManyToManyField(Cuisine, related_name='restaurants')

    remarks = models.JSONField(null=True, blank=True)
    cancellation_policy = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    RATING_CHOICES = (
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
    )

    user = models.ForeignKey('users.User',
                             on_delete=models.CASCADE,
                             related_name='reviews'
                             )
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name='reviews')
    reservation = models.OneToOneField(
        "reservations.Reservation", on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name} - {self.rating} stars"


class Invitation(models.Model):
    email = models.EmailField(unique=True)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    def mark_used(self):
        self.used_at = timezone.now()
        self.save()

    def __str__(self):
        return f"Invitation for {self.email} - {'Used' if self.used_at else 'Pending'}"
