from rest_framework import serializers
from .models import City, Cuisine, Restaurant, Review


class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = ['id', 'name']
        read_only_fields = ['id']


class RestaurantSerializer(serializers.ModelSerializer):
    cuisines = CuisineSerializer(many=True, read_only=True)
    city = serializers.CharField(source='city.name')
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'full_address', "city",
            'phone_number', 'opening_hours', 'image', 'max_dinning_time',
            'price_start_from', 'min_number_of_guests', 'max_number_of_guests',
            "highlights", "remarks", "cancellation_policy",
            'cuisines', 'created_at', 'updated_at', 'average_rating',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'average_rating']


class RestaurantCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            'name', 'description', 'full_address', 'phone_number',
            "city",

            'opening_hours', 'image', 'cuisines',
        ]


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

