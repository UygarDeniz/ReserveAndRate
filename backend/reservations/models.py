from django.db import models
from django.conf import settings
class Reservation(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    restaurant = models.ForeignKey('restaurants.Restaurant', 
                                   on_delete=models.CASCADE, 
                                   related_name='reservations')
    
    reservation_time = models.DateTimeField()
    number_of_guests = models.IntegerField()
    note = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name} on {self.reservation_time}"
    
    