from rest_framework import serializers
from apps.accounts.models import VendorProfile


class VendorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = [
            'restaurant_name',
            'restaurant_address',
            'resturant_pic',
            'is_verified',
            'is_open'
        ]
        read_only_fields = ['is_verified']