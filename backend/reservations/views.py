from datetime import datetime
from calendar import monthrange
from django.db import models
from django.db.models import F
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import TimeSlot, Reservation, BlockedDate
from rest_framework import generics
from .serializers import ReservationSerializer, UserReservationSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    @action(detail=False, methods=['GET'], url_path='available-days')
    def available_days(self, request):

        restaurant_id = request.query_params.get('restaurant_id')
        year = int(request.query_params.get('year', 0))
        month = int(request.query_params.get('month', 0))
        if not all([restaurant_id, year, month]):
            return Response(
                {"error": "restaurant_id, year, and month are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # blocked dates
        blocked_dates = set(BlockedDate.objects.filter(
            restaurant_id=restaurant_id,
            date__year=year,
            date__month=month
        ).values_list('date', flat=True))

        # find days that have at least one slot open
        _, days_in_month = monthrange(year, month)
        available_days = []
        for day in range(1, days_in_month + 1):
            date_obj = datetime(year, month, day).date()

            # Mark as unavailable if date is blocked
            if date_obj in blocked_dates:
                available_days.append(
                    {"date": date_obj.isoformat(), "available": False})
                continue

            # get any timeslot with available capacity
            has_open_slot = TimeSlot.objects.filter(
                restaurant_id=restaurant_id,
                date=date_obj,
                current_bookings__lt=F('max_bookings')
            ).exists()

            available_days.append({
                "date": date_obj.isoformat(),
                "available": has_open_slot
            })

        return Response(available_days)

    @action(detail=False, methods=['GET'], url_path='available-time-slots')
    def available_time_slots(self, request):
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

        # Filter timeslots by date with remaining capacity
        slots = TimeSlot.objects.filter(
            restaurant_id=restaurant_id,
            date=selected_date,
            current_bookings__lt=models.F('max_bookings')
        ).order_by('start_time')

        data = []
        for slot in slots:
            data.append({
                'id': slot.id,
                'start_time': slot.start_time.strftime('%H:%M'),
                'end_time': slot.end_time.strftime('%H:%M'),
                'available_capacity': slot.max_bookings - slot.current_bookings
            })

        return Response(data)


class UserReservationsView(generics.ListAPIView):
    queryset = Reservation.objects.all()
    serializer_class = UserReservationSerializer

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user).order_by('-created_at')
