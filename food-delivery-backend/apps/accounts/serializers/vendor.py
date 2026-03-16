from rest_framework import serializers
from apps.accounts.models import VendorProfile


class VendorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = [
            'restaurant_name',
            'restaurant_address',
            'resturant_pic',
            'restaurant_description',
            'GST_number',
            'Account_number',
            'opening_time',
            'closing_time',
            'is_verified',
            'is_open'
        ]
        read_only_fields = ['is_verified']