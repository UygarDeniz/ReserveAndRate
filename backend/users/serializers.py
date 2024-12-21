from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken

class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
        )

    password = serializers.CharField(write_only=True, required=True, 
                                     validators=[validate_password]
                                     )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
        )
    
    
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ["id", 'email', "username", "first_name", "last_name", "phone_number", 'password', 'password2']    
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone_number': {'required': True},
        }
            
    
    def validate(self, data):
        print(data)
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': 'Passwords must match'})
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 
                  'phone_number', 'profile_image',
                  'bio', 'created_at', 'updated_at'
                  ]
        read_only_fields = ['id', 'created_at', 'updated_at']

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
