from rest_framework import permissions, generics, status, views
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenObtainPairSerializer
from rest_framework_simplejwt import tokens
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken
from .serializers import UserRegistrationSerializer, UserSerializer
from .models import User


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer


class UserWithRefreshToken(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            print("No refresh token found in cookies")
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = CookieTokenRefreshSerializer(
            data={},
            context={'request': request}
        )

        if serializer.is_valid():
            access_token = serializer.validated_data['access']
            refresh_token = serializer.validated_data['refresh']

            user_id = tokens.RefreshToken(refresh_token).get('user_id')
            user = get_object_or_404(User, pk=user_id)

            response_data = UserSerializer(user).data
            response_data['access'] = access_token

            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie('refresh_token', 
                                refresh_token,
                                max_age=3600 * 24 * 14,
                                httponly=True
                                )
            return response
        else:
            print("Serializer is not valid:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        """
        If the refresh token is not found in the request cookie, raise an InvalidToken error.
        """

        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        if not attrs['refresh']:
            raise InvalidToken(
                "No valid token found in cookie 'refresh_token'")

        return super().validate(attrs)


class CookieTokenObtainPairView(jwt_views.TokenObtainPairView):
    """
    By default, the `TokenObtainPairView` returns the refresh and access token in the response body.
    Before finalizing the response, we set the refresh token in a cookie and remove it from the response body.
    Using it to to login on the frontend.
    """

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14  # 14 days
            response.set_cookie(
                'refresh_token', response.data['refresh'], max_age=cookie_max_age, httponly=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)

class Logout(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('refresh_token')
        return response


