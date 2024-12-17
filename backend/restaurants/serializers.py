from rest_framework import serializers
from .models import Cuisine, Restaurant, Review


class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = ['id', 'name']
        read_only_fields = ['id']

class RestaurantSerializer(serializers.ModelSerializer):
    cuisines = CuisineSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'description', 'address', 
            'phone_number', 'opening_hours', 'image',
            'cuisines', 'created_at', 'updated_at', 'average_rating',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'average_rating']

class RestaurantCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            'name', 'description', 'address', 'phone_number',
            'opening_hours', 'image', 'cuisines',
        ]


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    restaurant = serializers.PrimaryKeyRelatedField(queryset=Restaurant.objects.all())

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'restaurant', 'rating', 'comment',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

