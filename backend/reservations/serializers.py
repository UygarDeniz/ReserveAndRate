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
    available_spots = serializers.SerializerMethodField()

    class Meta:
        model = TimeSlot
        fields = ['id', 'date', 'start_time', 'end_time', 'is_available', 
                 'max_bookings', 'current_bookings', 'available_spots']

    def get_available_spots(self, obj):
        return obj.max_bookings - obj.current_bookings

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ["user"]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserReservationSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(source='time_slot.restaurant.name', read_only=True)
    date = serializers.DateField(source='time_slot.date', read_only=True)
    start_time = serializers.TimeField(source='time_slot.start_time', read_only=True)
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ["user"]
