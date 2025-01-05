from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'cuisines', views.CuisineViewSet)
router.register(r'restaurants', views.RestaurantViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'cities', views.CityViewSet)

urlpatterns = [
    
]

urlpatterns += router.urls
