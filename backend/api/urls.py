from django.urls import path, include

urlpatterns = [
    path('', include('restaurants.urls')),
    path('users/', include('users.urls')),
    path('reservations/', include('reservations.urls')),

]
