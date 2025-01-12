from django.urls import path
from . import views

urlpatterns = [
    path("restaurants/", views.RestaurantListView.as_view()),
    path("restaurants/<int:pk>/", views.RestaurantDetailView.as_view()),
    path("restaurants/owner-restaurant/", views.RestaurantOwnerView.as_view()),
    path("restaurants/cuisines/", views.CuisineListView.as_view()),
    path("restaurants/cities/", views.CityListView.as_view()),
    path("restaurants/<int:pk>/reviews/", views.RestaurantReviewsView.as_view()),
    path("user-reviews/", views.UserReviewListCreateView.as_view()),
    path("user-reviews/<int:pk>/", views.UserReviewDeleteView.as_view()),
    path('restaurants/invitations/accept/<uuid:token>/', views.AcceptInvitationView.as_view(), name='accept-invitation'),
]