from datetime import datetime
from django.db.models import Q, Count
from django.db.models import Avg
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework import permissions, status,  views, generics
from .models import City, Invitation, Restaurant, Cuisine, Review
from .serializers import (CitySerializer, RestaurantAccountRegisterationSerializer, RestaurantSerializer, CuisineSerializer,
                          RestaurantReviewSerializer, UserReviewSerializer, RestaurantUpdateSerializer)
                            

class CuisineListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cuisines = Cuisine.objects.all()
        serializer = CuisineSerializer(cuisines, many=True)
        return Response(serializer.data)


class CityListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cities = City.objects.all()
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)


class RestaurantListView(generics.ListAPIView):
    queryset = Restaurant.objects.all().annotate(
        average_rating=Avg('reviews__rating'),
        total_reviews=Count('reviews')
    )
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        base_queryset = Restaurant.objects.all().annotate(
            average_rating=Avg('reviews__rating'),
            total_reviews=Count('reviews')
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


class RestaurantDetailView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all().annotate(
        average_rating=Avg('reviews__rating'),
        total_reviews=Count("reviews")
    )
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.AllowAny]



class RestaurantReviewsView(generics.ListAPIView):
    """
    List all reviews for a restaurant
    """
    serializer_class = RestaurantReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('pk')
        return Review.objects.filter(restaurant__id=restaurant_id)


class UserReviewListCreateView(generics.ListCreateAPIView):
    """ 
    List and create reviews for the current user
    """
    serializer_class = UserReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only view their own reviews
        return Review.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        reservation = serializer.validated_data['reservation']
        user = self.request.user

        # Check that the user owns the reservation
        if reservation.user != user:
            raise ValidationError(
                "You cannot review a reservation that isn't yours.")

        # Check that the reservation is in the past
        reservation_end_datetime = datetime(reservation.time_slot.date.year, reservation.time_slot.date.month, reservation.time_slot.date.day,
                                            reservation.time_slot.end_time.hour, reservation.time_slot.end_time.minute)

        if reservation_end_datetime > datetime.now():
            raise ValidationError(
                "You can only review completed reservations.")

        # Check that a review for this reservation doesn't already exist
        if Review.objects.filter(reservation=reservation).exists():
            raise ValidationError(
                "A review for this reservation already exists.")

        serializer.save(user=user)


class UserReviewDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk)

        if review.user != request.user:
            raise ValidationError("You can only delete your own reviews.")

        review.delete()
        return Response(status=204)


class AcceptInvitationView(views.APIView):
    """
    Accept an invitation to create a restaurant account.
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request, token):
        invitation = get_object_or_404(
            Invitation, token=token, used_at__isnull=True)
        email = request.data.get('email')

        if not email or email != invitation.email:
            return Response(
                {"detail": "Email does not match the invitation."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = RestaurantAccountRegisterationSerializer(
            data=request.data)

        if serializer.is_valid():
            serializer.save()
            invitation.mark_used()
            return Response({"detail": "Registration complete."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RestaurantOwnerView(generics.RetrieveUpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if self.request.user.role != "restaurant":
            raise PermissionDenied("Not authorized.")
        return self.request.user.restaurant_profile
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RestaurantSerializer
        return RestaurantUpdateSerializer