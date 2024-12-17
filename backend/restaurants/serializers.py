from rest_framework import serializers
from .models import Restaurant, Cuisine
class RestaurantSerializer(serializers.Serializer):
    cuisines = serializers.StringRelatedField(many=True)
    class Meta:
        model = Restaurant
        fields = ["id", "name", "description", "address", "phone_number", "opening_hours", "image", "cuisine"]
        read_only_fields = ["id", "cuisines"]

class CuisineSerializer(serializers.Serializer):
    restaurants = serializers.StringRelatedField(many=True)
    class Meta:
        model = Cuisine
        fields = ["id", "name", "restaurants"]
        read_only_fields = ["id", "restaurants"]