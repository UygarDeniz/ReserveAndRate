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
    name = models.CharField(max_length=255)
    summary = models.CharField(max_length=255, null=False, blank=False, default='Default summary')
    description = models.TextField()
    city = models.ForeignKey(
        City, related_name='restaurants', on_delete=models.SET_NULL, null=True)
    full_address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    opening_hours = models.CharField(max_length=20)
    max_dinning_time = models.IntegerField(default=120)
    price_start_from = models.IntegerField(default=0)
    min_number_of_guests = models.IntegerField(default=0)
    max_number_of_guests = models.IntegerField(default=0)
    image = models.ImageField(upload_to='restaurant_images/')
    cuisines = models.ManyToManyField(Cuisine, related_name='restaurants')
    
    
    highlights = models.JSONField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
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
    restaurant = models.ForeignKey(Restaurant,
                                   on_delete=models.CASCADE,
                                   related_name='reviews'
                                   )
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name} - {self.rating} stars"
