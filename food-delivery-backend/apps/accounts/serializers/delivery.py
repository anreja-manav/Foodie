from rest_framework import serializers
from apps.accounts.models import DeliveryProfile


class DeliveryProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryProfile
        fields = ['vehicle_number', 'is_available']