from rest_framework import serializers
from apps.accounts.models import VendorProfile
from apps.restaurants.serializers import RestaurantDetailSerializer


class VendorProfileSerializer(serializers.ModelSerializer):
    restaurant = RestaurantDetailSerializer(read_only=True)

    class Meta:
        model = VendorProfile
        fields = [
            'is_verified',
            'restaurant',
        ]
        read_only_fields = ['is_verified']