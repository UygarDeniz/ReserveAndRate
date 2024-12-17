from django.urls import path, include

urlpatterns = [
    path('', include('restaurants.urls')),
    path('users/', include('users.urls')),
]
