from datetime import datetime
from calendar import monthrange
from django.db.models import F
from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import status, views, permissions
from rest_framework.response import Response
from restaurants.models import Restaurant
from .models import TimeSlot, Reservation, BlockedDate
from rest_framework import generics
from .serializers import ReservationSerializer, UserReservationSerializer, TimeSlotSerializer


class ReservationView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk=None):
        """
        If pk is supplied, retrieve single reservation.
        Otherwise, list all reservations.
        """
        if pk:
            try:
                reservation = Reservation.objects.get(pk=pk)
            except Reservation.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = ReservationSerializer(reservation)
            return Response(serializer.data)
        else:
            # List all reservations
            queryset = Reservation.objects.all()
            serializer = ReservationSerializer(queryset, many=True)
            return Response(serializer.data)

    def post(self, request):
        """
        Create a new reservation.
        """
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AvailableDaysView(views.APIView):
    """
    Return available days for a given restaurant and month.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        restaurant_id = request.query_params.get('restaurant_id')
        year = int(request.query_params.get('year', 0))
        month = int(request.query_params.get('month', 0))
        if not all([restaurant_id, year, month]):
            return Response(
                {"error": "restaurant_id, year, and month are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        today = datetime.now().date()

        blocked_dates = set(
            BlockedDate.objects.filter(
                restaurant_id=restaurant_id,
                date__year=year,
                date__month=month
            ).values_list('date', flat=True)
        )

        _, days_in_month = monthrange(year, month)
        available_days = []

        for day in range(1, days_in_month + 1):
            date_obj = datetime(year, month, day).date()
            if date_obj in blocked_dates:
                available_days.append(
                    {"date": date_obj.isoformat(), "available": False})
                continue

            if date_obj < today:
                available_days.append(
                    {"date": date_obj.isoformat(), "available": False})
                continue

            if date_obj == today:
                has_open_slot = TimeSlot.objects.filter(
                    restaurant_id=restaurant_id,
                    date=date_obj,
                    current_bookings__lt=F('max_bookings'),
                    start_time__gte=datetime.now().time()
                ).exists()
                available_days.append(
                    {"date": date_obj.isoformat(), "available": has_open_slot})
                continue

            available = TimeSlot.objects.filter(
                restaurant_id=restaurant_id,
                date=date_obj,
                current_bookings__lt=F('max_bookings')
            ).exists()

            available_days.append(
                {"date": date_obj.isoformat(), "available": available})
        return Response(available_days)


class AvailableTimeSlotsView(views.APIView):
    """
    Return available time slots for a given restaurant and date.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        restaurant_id = request.query_params.get('restaurant_id')
        date_str = request.query_params.get('date')
        if not all([restaurant_id, date_str]):
            return Response(
                {"error": "restaurant_id and date are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if selected_date < datetime.now().date():
            return Response(
                {"error": "Cannot book for a past date."},
                status=status.HTTP_400_BAD_REQUEST
            )

        today = datetime.now().date()

        if selected_date == today:
            slots = TimeSlot.objects.filter(
                restaurant_id=restaurant_id,
                date=selected_date,
                current_bookings__lt=F('max_bookings'),
                start_time__gte=datetime.now().time()
            ).order_by('start_time')
            slots = TimeSlotSerializer(slots, many=True).data
            return Response(slots)
        else:
            slots = TimeSlot.objects.filter(
                restaurant_id=restaurant_id,
                date=selected_date,
                current_bookings__lt=F('max_bookings')
            ).order_by('start_time')

            slots = TimeSlotSerializer(slots, many=True).data
            return Response(slots)


class UserReservationsView(generics.ListAPIView):
    """
    List all reservations for the authenticated user.
    """
    queryset = Reservation.objects.all()
    serializer_class = UserReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user).order_by('-created_at')

class RestaurantReservationsView(generics.ListAPIView):
    """
    List all reservations for the authenticated user.
    """
    queryset = Reservation.objects.all()
    serializer_class = UserReservationSerializer

    def get_queryset(self):
        if self.request.user.role != 'restaurant':
            raise ValidationError(
                "You must be a restaurant owner to view reservations.")
        if self.request.user.restaurant_profile is None:
            raise ValidationError(
                "You must be a restaurant owner to view reservations.")
        return Reservation.objects.filter(time_slot__restaurant=self.request.user.restaurant_profile).order_by('-created_at')
    

class TimeSlotCreateView(generics.CreateAPIView):
    """
    Create a new time slot for a restaurant.
    """
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'restaurant':
            raise ValidationError(
                "You must be a restaurant owner to create time slots.")
        if self.request.user.restaurant_profile != serializer.validated_data['restaurant']:
            raise ValidationError(
                "You can only create time slots for your own restaurant.")

        serializer.save(restaurant=self.request.user.restaurant_profile)
        
class TimeSlotDeleteView(generics.DestroyAPIView):
    """
    Delete a time slot.
    """
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        if self.request.user.role != 'restaurant':
            raise ValidationError(
                "You must be a restaurant owner to delete time slots.")
        if self.request.user.restaurant_profile is None:
            raise ValidationError(
                "You must be a restaurant owner to delete time slots.")
        if self.request.user.restaurant_profile != instance.restaurant:
            raise ValidationError(
                "You can only delete time slots for your own restaurant.")
        instance.delete()