from django.urls import path
from . import views

urlpatterns = [
    path("", views.RestaurantsView.as_view()),
    path("<int:pk>/", views.RestaurantDetailView.as_view()),
]
