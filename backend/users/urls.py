from django.urls import path
from . import views
urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("me/", views.UserWithRefreshToken.as_view(), name="me"),
    path("token/", views.CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("logout/", views.Logout.as_view(), name="logout"),
]
