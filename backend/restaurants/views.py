from django.db.models import Avg
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.decorators import action
from .models import City, Restaurant, Cuisine, Review
from .serializers import (CitySerializer, RestaurantSerializer, RestaurantCreateUpdateSerializer,
                          CuisineSerializer, ReviewSerializer)
from django.db.models import Q


class CuisineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all().annotate(
        average_rating=Avg('reviews__rating')
    )

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        base_queryset = Restaurant.objects.all().annotate(
            average_rating=Avg('reviews__rating')
        )

        q = self.request.query_params.get('q', None)
        city = self.request.query_params.get('city', None)
        cuisine = self.request.query_params.get('cuisine', None)
        order_by = self.request.query_params.get('order_by', "name")
        
        base_queryset = base_queryset.order_by(order_by)
        
        if city:
            base_queryset = base_queryset.filter(city__name=city)
            
        if cuisine:
            base_queryset = base_queryset.filter(cuisines__name=cuisine)
        
        if q:
            return base_queryset.filter(
                Q(name__icontains=q) |
                Q(description__icontains=q) |
                Q(full_address__icontains=q) |
                Q(city__name__icontains=q) |
                Q(cuisines__name__icontains=q)
            )
        return base_queryset

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return RestaurantSerializer
        return RestaurantCreateUpdateSerializer

    # Get Restaurant Reviews
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def reviews(self, request, pk=None):
        restaurant = self.get_object()
        reviews = restaurant.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

# Users can view their own reviews


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    

