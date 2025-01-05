from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ReservationViewSet, basename='reservation')

urlpatterns = [
    path("user-reservations/", views.UserReservationsView.as_view(), name="user-reservations"),
    path('', include(router.urls)),
]