from django.urls import path
from . import views

urlpatterns = [
    path("", views.ReservationView.as_view(), name="reservations"),
    path("<int:pk>/", views.ReservationView.as_view(), name="reservation"),
    path("time-slots/", views.TimeSlotCreateView.as_view(), name="time-slots"),
    path("time-slots/<int:pk>/", views.TimeSlotDeleteView.as_view(), name="time-slot"),
    path("available-days/", views.AvailableDaysView.as_view(), name="available-days"),
    path("available-time-slots/", views.AvailableTimeSlotsView.as_view(), name="available-time-slots"),
    path("user-reservations/", views.UserReservationsView.as_view(), name="user-reservations"),
    path("restaurant-reservations/", views.RestaurantReservationsView.as_view(), name="restaurant-reservations"),
]