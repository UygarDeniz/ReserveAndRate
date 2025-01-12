from django.db import models
from django.contrib.auth.models import AbstractUser
ROLES = (
 ("restaurant", "Restaurant"),
 ("customer", "Customer"),
)
class User(AbstractUser):
    role = models.CharField(max_length=20, choices=ROLES, default='customer')
    profile_image = models.ImageField(upload_to='profile_images/', 
                                      null=True, 
                                      blank=True, 
                                      default='profile_images/default.jpg')
    bio = models.TextField(max_length=500, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    def __str__(self):
        return self.full_name
    

