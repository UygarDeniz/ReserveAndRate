from datetime import datetime
from rest_framework import serializers
from .models import BusinessHours, BlockedDate, TimeSlot, Reservation


class BusinessHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessHours
        fields = '__all__'


class BlockedDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedDate
        fields = '__all__'


class TimeSlotSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_time', "restaurant", "max_bookings","date"]


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ["user"]


class UserReservationSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(
        source='time_slot.restaurant.name', read_only=True)
    restaurant_id = serializers.IntegerField(
        source='time_slot.restaurant.id', read_only=True)
    date = serializers.DateField(source='time_slot.date', read_only=True)
    start_time = serializers.TimeField(
        source='time_slot.start_time', read_only=True)
    review = serializers.PrimaryKeyRelatedField(read_only=True)
    is_past = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ["user"]

    def get_is_past(self, obj):
        return obj.time_slot.date < datetime.now().date() or (
            obj.time_slot.date == datetime.now().date(
            ) and obj.time_slot.end_time < datetime.now().time()
        )
