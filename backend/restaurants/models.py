from django.db import models

class Cuisine(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    opening_hours = models.CharField(max_length=20)
    image = models.ImageField(upload_to='restaurant_images/')
    cuisines = models.ManyToManyField(Cuisine, related_name='restaurants')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

"""
 CUISINE_CHOICES = (
        ('American', 'American'),
        ('Chinese', 'Chinese'),
        ('Indian', 'Indian'),
        ('Italian', 'Italian'),
        ('Japanese', 'Japanese'),
        ('Mexican', 'Mexican'),
        ('Thai', 'Thai'),
    )
"""
    



    
