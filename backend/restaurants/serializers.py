from rest_framework import serializers
from .models import City, Cuisine, Restaurant, Review
from users.models import User
from django.contrib.auth.password_validation import validate_password


class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = ['id', 'name']
        read_only_fields = ['id']

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']
        read_only_fields = ['id']
        
class RestaurantSerializer(serializers.ModelSerializer):
    cuisines = CuisineSerializer(many=True, read_only=True)
    city = CitySerializer(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'full_address', "city",
            'phone_number', 'opening_hours', 'image', 'max_dinning_time',
            'price_start_from', 'min_number_of_guests', 'max_number_of_guests',
             "remarks", "cancellation_policy", "summary", "total_reviews",
            'cuisines',  'average_rating',
        ]
        read_only_fields = ['id', 'average_rating']

class RestaurantUpdateSerializer(serializers.ModelSerializer):
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), required=False)
    cuisines = serializers.PrimaryKeyRelatedField(queryset=Cuisine.objects.all(), many=True, required=False)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'full_address', 'city',
            'phone_number', 'opening_hours', 'image', 'max_dinning_time',
            'price_start_from', 'min_number_of_guests', 'max_number_of_guests',
            'remarks', 'cancellation_policy',
            'cuisines', 'average_rating', "summary"
        ]
        read_only_fields = ['id', 'average_rating']

    def update(self, instance, validated_data):
        # Update city if provided
        if 'city' in validated_data:
            instance.city = validated_data.pop('city')

        # Update cuisines if provided
        if 'cuisines' in validated_data:
            cuisines_data = validated_data.pop('cuisines')
            instance.cuisines.set(cuisines_data)

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    restaurant = serializers.PrimaryKeyRelatedField(
        queryset=Restaurant.objects.all())

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'restaurant', 'rating', 'comment',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']
        read_only_fields = ['id']


class UserReviewSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(
        source='restaurant.name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'restaurant', 'reservation', 'rating',
            'comment', 'created_at', 'updated_at', 'restaurant_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', "user"]


class RestaurantReviewSerializer(serializers.ModelSerializer):
    user = serializers.CharField(
        source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'user',
            'rating', 'comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user',
                            'created_at', 'updated_at']


class RestaurantAccountRegisterationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True,
                                     validators=[validate_password]
                                     )
    password2 = serializers.CharField(write_only=True, required=True)
    restaurant_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", 'email', "username", "first_name", "last_name",
                  "phone_number", 'password', 'password2', 'restaurant_name']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone_number': {'required': True},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError(
                {'password2': 'Passwords must match'})

        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        restaurant_name = validated_data.pop('restaurant_name')
        user = User.objects.create_user(**validated_data, role="restaurant")

        Restaurant.objects.create(user=user, name=restaurant_name)
        return user
