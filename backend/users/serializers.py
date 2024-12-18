from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
        )

    password = serializers.CharField(write_only=True, required=True, 
                                     validators=[validate_password]
                                     )
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ["id", 'email', "phone_number", "profile_image","bio", 'password', 'password2']    
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
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
         