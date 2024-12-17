from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Restaurant
from .serializers import RestaurantSerializer
class RestaurantsView(APIView):
    def get(self, request):
        # Get all restaurants
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        print(serializer)
        return Response(serializer.data)
    

class RestaurantDetailView(APIView):
    def get(self, request, pk):
        # Get a single restaurant
        try:
            restaurant = Restaurant.objects.get(pk=pk)
        except Restaurant.DoesNotExist:
            return Response({"message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)
